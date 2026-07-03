const { syncAlipayOrder } = require("./alipay/query");
const { syncWechatOrder } = require("./wechat/query");
const { getOrder } = require("../lib/orders");
const { methodNotAllowed, sendJson } = require("../lib/http");

module.exports = async function handler(req, res) {
  if (req.method !== "GET") return methodNotAllowed(res, ["GET"]);
  try {
    let order = await getOrder(req.query?.orderId);
    if (!order) return sendJson(res, 404, { ok: false, error: "ORDER_NOT_FOUND" });
    let syncWarning = null;
    if (order.status === "PENDING_PAYMENT" && order.paymentProvider) {
      try {
        if (order.paymentProvider === "alipay") order = await syncAlipayOrder(order);
        if (order.paymentProvider === "wechat") order = await syncWechatOrder(order);
      } catch (error) {
        syncWarning = error.code || "PAYMENT_QUERY_SKIPPED";
      }
    }
    sendJson(res, 200, {
      ok: true,
      order: {
        id: order.id,
        status: order.status,
        paymentStatus: order.paymentStatus,
        paymentProvider: order.paymentProvider,
        paymentChannel: order.paymentChannel,
        platformTradeNo: order.platformTradeNo,
        amountCents: order.amountCents,
        total: order.total
      },
      syncWarning
    });
  } catch (error) {
    sendJson(res, error.code === "PAYMENT_CONFIG_MISSING" ? 503 : 400, {
      ok: false,
      error: error.code || "PAYMENT_STATUS_FAILED",
      message: error.message,
      missing: error.missing
    });
  }
};
