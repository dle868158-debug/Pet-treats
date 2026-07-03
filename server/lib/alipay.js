const { AlipaySdk } = require("alipay-sdk");
const { alipayGateway, requiredEnv } = require("./env");

function formatYuan(amountCents) {
  return (Number(amountCents) / 100).toFixed(2);
}

function alipaySdk() {
  requiredEnv(["ALIPAY_APP_ID", "ALIPAY_PRIVATE_KEY", "ALIPAY_PUBLIC_KEY"]);
  const gateway = alipayGateway();
  if (!gateway) {
    const error = new Error("缺少支付宝网关配置");
    error.code = "PAYMENT_CONFIG_MISSING";
    error.missing = ["ALIPAY_GATEWAY_SANDBOX/ALIPAY_GATEWAY_PROD"];
    throw error;
  }
  return new AlipaySdk({
    appId: process.env.ALIPAY_APP_ID,
    privateKey: process.env.ALIPAY_PRIVATE_KEY.replace(/\\n/g, "\n"),
    alipayPublicKey: process.env.ALIPAY_PUBLIC_KEY.replace(/\\n/g, "\n"),
    gateway,
    signType: "RSA2",
    keyType: "PKCS8"
  });
}

function createAlipayPayload(order, channel, baseUrl) {
  const sdk = alipaySdk();
  const method = channel === "wap" ? "alipay.trade.wap.pay" : "alipay.trade.page.pay";
  const productCode = channel === "wap" ? "QUICK_WAP_WAY" : "FAST_INSTANT_TRADE_PAY";
  const bizContent = {
    out_trade_no: order.id,
    product_code: productCode,
    total_amount: formatYuan(order.amountCents),
    subject: `爪味自然订单 ${order.id}`,
    body: order.items.map((item) => `${item.name}x${item.quantity}`).join("，"),
    timeout_express: "30m"
  };
  const common = {
    bizContent,
    notifyUrl: `${baseUrl}/api/webhooks/alipay`,
    returnUrl: `${baseUrl}/index.html#payment-return`
  };
  const mode = channel === "wap" ? "GET" : "POST";
  const paymentRequest = sdk.pageExecute(method, mode, common);
  return {
    provider: "alipay",
    channel,
    type: channel === "wap" ? "redirect" : "html",
    mode: channel === "wap" ? "redirect" : "html",
    url: channel === "wap" ? paymentRequest : null,
    paymentUrl: channel === "wap" ? paymentRequest : null,
    formHtml: channel === "wap" ? null : paymentRequest,
    html: channel === "wap" ? null : paymentRequest
  };
}

async function queryAlipay(order) {
  const sdk = alipaySdk();
  return sdk.exec("alipay.trade.query", {
    bizContent: {
      out_trade_no: order.id
    }
  });
}

async function closeAlipay(order) {
  const sdk = alipaySdk();
  return sdk.exec("alipay.trade.close", {
    bizContent: {
      out_trade_no: order.id
    }
  });
}

function verifyAlipayNotify(payload, order) {
  const sdk = alipaySdk();
  if (!sdk.checkNotifySignV2(payload)) return { ok: false, reason: "INVALID_SIGNATURE" };
  if (payload.app_id !== process.env.ALIPAY_APP_ID) return { ok: false, reason: "INVALID_APP_ID" };
  if (payload.out_trade_no !== order.id) return { ok: false, reason: "INVALID_ORDER_ID" };
  if (Math.round(Number(payload.total_amount) * 100) !== order.amountCents) {
    return { ok: false, reason: "AMOUNT_MISMATCH" };
  }
  if (process.env.ALIPAY_SELLER_ID && payload.seller_id !== process.env.ALIPAY_SELLER_ID) {
    return { ok: false, reason: "INVALID_SELLER" };
  }
  if (!["TRADE_SUCCESS", "TRADE_FINISHED"].includes(payload.trade_status)) {
    return { ok: false, reason: "UNPAID_STATUS" };
  }
  return { ok: true };
}

module.exports = {
  closeAlipay,
  createAlipayPayload,
  queryAlipay,
  verifyAlipayNotify
};
