const { verifyAlipayNotify } = require("../server/lib/alipay");
const { decryptWechatResource, verifyWechatSignature } = require("../server/lib/wechat");
const { getOrder, markClosed, markPaid, recordWebhook } = require("../server/lib/orders");
const { methodNotAllowed, readForm, readRawBody } = require("../server/lib/http");

async function handleAlipay(req, res) {
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
    return res.end("success");
  } catch {
    res.statusCode = 400;
    return res.end("fail");
  }
}

async function handleWechat(req, res) {
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
    return res.end(JSON.stringify({ code: "SUCCESS", message: "成功" }));
  } catch {
    res.statusCode = 400;
    return res.end(JSON.stringify({ code: "FAIL", message: "bad request" }));
  }
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") return methodNotAllowed(res, ["POST"]);
  if (req.query?.provider === "alipay") return handleAlipay(req, res);
  if (req.query?.provider === "wechat") return handleWechat(req, res);
  res.statusCode = 404;
  return res.end("not found");
};
