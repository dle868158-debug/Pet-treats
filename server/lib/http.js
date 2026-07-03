function sendJson(res, statusCode, payload) {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(payload));
}

function methodNotAllowed(res, methods = ["POST"]) {
  res.setHeader("Allow", methods.join(", "));
  sendJson(res, 405, { ok: false, error: "METHOD_NOT_ALLOWED" });
}

function readRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

async function readJson(req) {
  if (req.body && typeof req.body === "object") return req.body;
  const raw = await readRawBody(req);
  if (!raw.length) return {};
  return JSON.parse(raw.toString("utf8"));
}

async function readForm(req) {
  if (req.body && typeof req.body === "object") return req.body;
  const raw = await readRawBody(req);
  return Object.fromEntries(new URLSearchParams(raw.toString("utf8")));
}

function getBearerToken(req) {
  const header = req.headers.authorization || "";
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match ? match[1] : "";
}

function getBaseUrl(req) {
  return process.env.APP_BASE_URL || `https://${req.headers.host}`;
}

function getClientIp(req) {
  return (
    req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
    req.headers["x-real-ip"] ||
    req.socket?.remoteAddress ||
    "127.0.0.1"
  );
}

module.exports = {
  getBaseUrl,
  getBearerToken,
  getClientIp,
  methodNotAllowed,
  readForm,
  readJson,
  readRawBody,
  sendJson
};
