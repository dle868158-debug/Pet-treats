const { getBearerToken, methodNotAllowed, sendJson } = require("../lib/http");
const { listOrders } = require("../lib/orders");

module.exports = async function handler(req, res) {
  if (req.method !== "GET") return methodNotAllowed(res, ["GET"]);
  const token = getBearerToken(req) || req.query?.token;
  if (!process.env.ADMIN_DASHBOARD_TOKEN || token !== process.env.ADMIN_DASHBOARD_TOKEN) {
    return sendJson(res, 401, { ok: false, error: "UNAUTHORIZED" });
  }
  try {
    const orders = await listOrders(200);
    sendJson(res, 200, { ok: true, orders });
  } catch (error) {
    sendJson(res, error.code === "PAYMENT_CONFIG_MISSING" ? 503 : 500, {
      ok: false,
      error: error.code || "ORDER_LIST_FAILED",
      message: error.message,
      missing: error.missing
    });
  }
};
