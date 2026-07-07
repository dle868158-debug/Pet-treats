const { closeAlipay } = require("../server/lib/alipay");
const { closeWechat } = require("../server/lib/wechat");
const { createOrder, getOrder, listOrders, markClosed } = require("../server/lib/orders");
const { getBearerToken, methodNotAllowed, readJson, sendJson } = require("../server/lib/http");
const { rateLimit } = require("../server/lib/rate-limit");

function handleError(res, error) {
  const status = error.code === "PAYMENT_CONFIG_MISSING" ? 503 : 400;
  sendJson(res, status, { ok: false, error: error.code || "ORDER_CREATE_FAILED", message: error.message, missing: error.missing });
}

module.exports = async function handler(req, res) {
  const action = req.query?.action || "create";

  if (action === "list") {
    if (req.method !== "GET") return methodNotAllowed(res, ["GET"]);
    const token = getBearerToken(req) || req.query?.token;
    if (!process.env.ADMIN_DASHBOARD_TOKEN || token !== process.env.ADMIN_DASHBOARD_TOKEN) {
      return sendJson(res, 401, { ok: false, error: "UNAUTHORIZED" });
    }
    try {
      return sendJson(res, 200, { ok: true, orders: await listOrders(200) });
    } catch (error) {
      return sendJson(res, error.code === "PAYMENT_CONFIG_MISSING" ? 503 : 500, {
        ok: false,
        error: error.code || "ORDER_LIST_FAILED",
        message: error.message,
        missing: error.missing
      });
    }
  }

  if (action === "close") {
    if (req.method !== "POST") return methodNotAllowed(res, ["POST"]);
    try {
      const { orderId } = await readJson(req);
      const order = await getOrder(orderId);
      if (!order) return sendJson(res, 404, { ok: false, error: "ORDER_NOT_FOUND" });
      if (order.status === "PAID") return sendJson(res, 409, { ok: false, error: "ORDER_ALREADY_PAID" });
      if (order.paymentProvider === "alipay") await closeAlipay(order);
      if (order.paymentProvider === "wechat") await closeWechat(order);
      return sendJson(res, 200, { ok: true, order: await markClosed(order) });
    } catch (error) {
      return sendJson(res, error.code === "PAYMENT_CONFIG_MISSING" ? 503 : 400, {
        ok: false,
        error: error.code || "ORDER_CLOSE_FAILED",
        message: error.message,
        missing: error.missing
      });
    }
  }

  if (action !== "create") return sendJson(res, 404, { ok: false, error: "ORDER_ACTION_NOT_FOUND" });
  if (req.method !== "POST") return methodNotAllowed(res, ["POST"]);
  if (await rateLimit(req, res, { prefix: "order", limit: 10, windowSec: 60 })) return;
  try {
    const body = await readJson(req);
    const order = await createOrder({
      cartItems: body.items || body.cartItems || [],
      customer: body.customer || {},
      address: body.address || {}
    });
    sendJson(res, 200, { ok: true, order });
  } catch (error) {
    handleError(res, error);
  }
};
