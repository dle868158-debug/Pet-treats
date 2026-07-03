const { Redis } = require("@upstash/redis");

let redisClient = null;

function redisConfig() {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  const missing = [];
  if (!url) missing.push("UPSTASH_REDIS_REST_URL/KV_REST_API_URL");
  if (!token) missing.push("UPSTASH_REDIS_REST_TOKEN/KV_REST_API_TOKEN");
  if (missing.length) {
    const error = new Error(`缺少环境变量：${missing.join(", ")}`);
    error.code = "PAYMENT_CONFIG_MISSING";
    error.missing = missing;
    throw error;
  }
  return { url, token };
}

function redis() {
  if (!redisClient) {
    redisClient = new Redis(redisConfig());
  }
  return redisClient;
}

module.exports = { redis };
