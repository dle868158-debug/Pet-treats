const { redis } = require("./redis");

/**
 * Sliding window rate limiter backed by Upstash Redis sorted sets.
 * Returns { allowed: boolean, remaining: number, retryAfter: number }.
 */
async function checkRateLimit(key, limit, windowSec) {
  const now = Date.now();
  const windowStart = now - windowSec * 1000;
  const r = redis();

  // Remove entries outside the window, then count remaining.
  await r.zremrangebyscore(key, 0, windowStart);
  const count = await r.zcard(key);

  if (count >= limit) {
    // Oldest entry in the window determines when the next slot opens.
    const oldest = await r.zrange(key, 0, 0, { withScores: true });
    const retryAfter = oldest.length >= 2
      ? Math.ceil((oldest[1] + windowSec * 1000 - now) / 1000)
      : windowSec;
    return { allowed: false, remaining: 0, retryAfter: Math.max(1, retryAfter) };
  }

  await r.zadd(key, { score: now, member: `${now}:${Math.random().toString(36).slice(2, 8)}` });
  await r.expire(key, windowSec + 10);
  return { allowed: true, remaining: limit - count - 1, retryAfter: 0 };
}

/**
 * Express-style middleware for Vercel serverless functions.
 * Returns true if the request is rate-limited (response already sent).
 */
async function rateLimit(req, res, { prefix = "rl", limit = 10, windowSec = 60 } = {}) {
  const ip = (req.headers["x-forwarded-for"] || req.headers["x-real-ip"] || "unknown").split(",")[0].trim();
  const key = `paw:${prefix}:${ip}`;

  try {
    const result = await checkRateLimit(key, limit, windowSec);
    res.setHeader("X-RateLimit-Limit", String(limit));
    res.setHeader("X-RateLimit-Remaining", String(result.remaining));

    if (!result.allowed) {
      res.setHeader("Retry-After", String(result.retryAfter));
      const { sendJson } = require("./http");
      sendJson(res, 429, { ok: false, error: "RATE_LIMITED", message: "请求过于频繁，请稍后再试", retryAfter: result.retryAfter });
      return true;
    }
  } catch {
    // If Redis fails, allow the request through — availability over strictness.
  }
  return false;
}

module.exports = { checkRateLimit, rateLimit };
