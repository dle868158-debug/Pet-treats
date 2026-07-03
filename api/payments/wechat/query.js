const { mapWechatState, queryWechat } = require("../../lib/wechat");
const { getOrder, markClosed, markPaid } = require("../../lib/orders");
const { methodNotAllowed, readJson, sendJson } = require("../../lib/http");

async function syncWechatOrder(order) {
  const data = await queryWechat(order);
  const mapped = mapWechatState(data.trade_state);
  if (mapped === "PAID") {
    return markPaid(order, { paymentProvider: "wechat", platformTradeNo: data.transaction_id });
  }
  if (mapped === "CLOSED") {
    return markClosed(order, { paymentProvider: "wechat", platformTradeNo: data.transaction_id });
  }
  return order;
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") return methodNotAllowed(res, ["POST"]);
  try {
    const { orderId } = await readJson(req);
    const order = await getOrder(orderId);
    if (!order) return sendJson(res, 404, { ok: false, error: "ORDER_NOT_FOUND" });
    const updated = await syncWechatOrder(order);
    sendJson(res, 200, { ok: true, order: updated });
  } catch (error) {
    sendJson(res, error.code === "PAYMENT_CONFIG_MISSING" ? 503 : error.statusCode || 400, {
      ok: false,
      error: error.code || "WECHAT_QUERY_FAILED",
      message: error.message,
      missing: error.missing,
      data: error.data
    });
  }
};

module.exports.syncWechatOrder = syncWechatOrder;
