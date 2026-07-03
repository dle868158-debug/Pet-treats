const { decryptWechatResource, verifyWechatSignature } = require("../lib/wechat");
const { getOrder, markClosed, markPaid, recordWebhook } = require("../lib/orders");
const { methodNotAllowed, readRawBody } = require("../lib/http");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") return methodNotAllowed(res, ["POST"]);
  try {
    const rawBody = await readRawBody(req);
    if (!verifyWechatSignature(req, rawBody)) {
      res.statusCode = 401;
      return res.end(JSON.stringify({ code: "FAIL", message: "invalid signature" }));
    }
    const payload = JSON.parse(rawBody.toString("utf8"));
    const resource = decryptWechatResource(payload.resource);
    const order = await getOrder(resource.out_trade_no);
    if (!order) {
      res.statusCode = 404;
      return res.end(JSON.stringify({ code: "FAIL", message: "order not found" }));
    }
    if (resource.mchid !== process.env.WECHAT_MCH_ID || resource.appid !== process.env.WECHAT_APP_ID) {
      res.statusCode = 400;
      return res.end(JSON.stringify({ code: "FAIL", message: "merchant mismatch" }));
    }
    if (Number(resource.amount?.total) !== order.amountCents) {
      res.statusCode = 400;
      return res.end(JSON.stringify({ code: "FAIL", message: "amount mismatch" }));
    }
    const eventId = payload.id || `${resource.out_trade_no}:${resource.transaction_id}:${resource.trade_state}`;
    const firstSeen = await recordWebhook("wechat", eventId, payload);
    if (firstSeen && resource.trade_state === "SUCCESS") {
      await markPaid(order, {
        paymentProvider: "wechat",
        platformTradeNo: resource.transaction_id,
        paidAt: resource.success_time || new Date().toISOString()
      });
    } else if (firstSeen && ["CLOSED", "REVOKED", "PAYERROR"].includes(resource.trade_state)) {
      await markClosed(order, {
        paymentProvider: "wechat",
        platformTradeNo: resource.transaction_id
      });
    }
    res.statusCode = 200;
    res.end(JSON.stringify({ code: "SUCCESS", message: "成功" }));
  } catch {
    res.statusCode = 400;
    res.end(JSON.stringify({ code: "FAIL", message: "bad request" }));
  }
};
