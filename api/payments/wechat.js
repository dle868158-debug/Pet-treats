const { createWechatPayload } = require("../lib/wechat");
const { getBaseUrl, methodNotAllowed, readJson, sendJson } = require("../lib/http");
const { getOrder, savePayment } = require("../lib/orders");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") return methodNotAllowed(res, ["POST"]);
  try {
    const { orderId, channel } = await readJson(req);
    const order = await getOrder(orderId);
    if (!order) return sendJson(res, 404, { ok: false, error: "ORDER_NOT_FOUND" });
    if (order.status === "PAID") return sendJson(res, 409, { ok: false, error: "ORDER_ALREADY_PAID" });
    if (order.status === "CLOSED") return sendJson(res, 409, { ok: false, error: "ORDER_CLOSED" });
    const resolvedChannel = channel === "h5" ? "h5" : "native";
    const payment = await createWechatPayload(order, resolvedChannel, getBaseUrl(req), req);
    await savePayment(order.id, payment);
    sendJson(res, 200, { ok: true, order, payment });
  } catch (error) {
    sendJson(res, error.code === "PAYMENT_CONFIG_MISSING" ? 503 : error.statusCode || 400, {
      ok: false,
      error: error.code || "WECHAT_CREATE_FAILED",
      message: error.message,
      missing: error.missing,
      data: error.data
    });
  }
};
