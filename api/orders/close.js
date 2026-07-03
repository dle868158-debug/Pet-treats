const { closeAlipay } = require("../lib/alipay");
const { closeWechat } = require("../lib/wechat");
const { getOrder, markClosed } = require("../lib/orders");
const { methodNotAllowed, readJson, sendJson } = require("../lib/http");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") return methodNotAllowed(res, ["POST"]);
  try {
    const { orderId } = await readJson(req);
    const order = await getOrder(orderId);
    if (!order) return sendJson(res, 404, { ok: false, error: "ORDER_NOT_FOUND" });
    if (order.status === "PAID") return sendJson(res, 409, { ok: false, error: "ORDER_ALREADY_PAID" });
    if (order.paymentProvider === "alipay") await closeAlipay(order);
    if (order.paymentProvider === "wechat") await closeWechat(order);
    const updated = await markClosed(order);
    sendJson(res, 200, { ok: true, order: updated });
  } catch (error) {
    sendJson(res, error.code === "PAYMENT_CONFIG_MISSING" ? 503 : 400, {
      ok: false,
      error: error.code || "ORDER_CLOSE_FAILED",
      message: error.message,
      missing: error.missing
    });
  }
};
