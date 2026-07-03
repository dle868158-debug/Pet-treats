const { queryAlipay } = require("../../lib/alipay");
const { getOrder, markClosed, markPaid } = require("../../lib/orders");
const { methodNotAllowed, readJson, sendJson } = require("../../lib/http");

async function syncAlipayOrder(order) {
  const result = await queryAlipay(order);
  const data = result?.data || result;
  const tradeStatus = data?.trade_status || data?.tradeStatus;
  if (["TRADE_SUCCESS", "TRADE_FINISHED"].includes(tradeStatus)) {
    return markPaid(order, { paymentProvider: "alipay", platformTradeNo: data.trade_no || data.tradeNo });
  }
  if (["TRADE_CLOSED"].includes(tradeStatus)) {
    return markClosed(order, { paymentProvider: "alipay", platformTradeNo: data.trade_no || data.tradeNo });
  }
  return order;
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") return methodNotAllowed(res, ["POST"]);
  try {
    const { orderId } = await readJson(req);
    const order = await getOrder(orderId);
    if (!order) return sendJson(res, 404, { ok: false, error: "ORDER_NOT_FOUND" });
    const updated = await syncAlipayOrder(order);
    sendJson(res, 200, { ok: true, order: updated });
  } catch (error) {
    sendJson(res, error.code === "PAYMENT_CONFIG_MISSING" ? 503 : 400, {
      ok: false,
      error: error.code || "ALIPAY_QUERY_FAILED",
      message: error.message,
      missing: error.missing
    });
  }
};

module.exports.syncAlipayOrder = syncAlipayOrder;
