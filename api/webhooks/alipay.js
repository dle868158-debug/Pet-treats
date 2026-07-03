const { verifyAlipayNotify } = require("../lib/alipay");
const { getOrder, markPaid, recordWebhook } = require("../lib/orders");
const { methodNotAllowed, readForm } = require("../lib/http");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") return methodNotAllowed(res, ["POST"]);
  try {
    const payload = await readForm(req);
    const order = await getOrder(payload.out_trade_no);
    if (!order) {
      res.statusCode = 404;
      return res.end("fail");
    }
    const verification = verifyAlipayNotify(payload, order);
    if (!verification.ok) {
      res.statusCode = 400;
      return res.end("fail");
    }
    const eventId = payload.notify_id || `${payload.out_trade_no}:${payload.trade_no}:${payload.trade_status}`;
    const firstSeen = await recordWebhook("alipay", eventId, payload);
    if (firstSeen) {
      await markPaid(order, {
        paymentProvider: "alipay",
        platformTradeNo: payload.trade_no,
        paidAt: payload.gmt_payment || new Date().toISOString()
      });
    }
    res.statusCode = 200;
    res.end("success");
  } catch {
    res.statusCode = 400;
    res.end("fail");
  }
};
