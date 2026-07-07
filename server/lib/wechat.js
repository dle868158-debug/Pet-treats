const crypto = require("crypto");
const QRCode = require("qrcode");
const { getClientIp } = require("./http");
const { requiredEnv } = require("./env");

const WECHAT_API = "https://api.mch.weixin.qq.com";

function privateKey() {
  return process.env.WECHAT_PRIVATE_KEY.replace(/\\n/g, "\n");
}

function platformPublicKey() {
  return process.env.WECHAT_PLATFORM_CERT_PUBLIC_KEY?.replace(/\\n/g, "\n") || "";
}

function ensureWechatPaymentConfig() {
  requiredEnv(["WECHAT_MCH_ID", "WECHAT_APP_ID", "WECHAT_API_V3_KEY", "WECHAT_PRIVATE_KEY", "WECHAT_SERIAL_NO"]);
}

function nonce() {
  return crypto.randomBytes(16).toString("hex");
}

function sign(method, urlPath, body = "") {
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const nonceStr = nonce();
  const message = `${method}\n${urlPath}\n${timestamp}\n${nonceStr}\n${body}\n`;
  const signature = crypto.createSign("RSA-SHA256").update(message).sign(privateKey(), "base64");
  const authorization = [
    'WECHATPAY2-SHA256-RSA2048',
    `mchid="${process.env.WECHAT_MCH_ID}"`,
    `nonce_str="${nonceStr}"`,
    `signature="${signature}"`,
    `timestamp="${timestamp}"`,
    `serial_no="${process.env.WECHAT_SERIAL_NO}"`
  ].join(",");
  return authorization;
}

async function wechatFetch(method, urlPath, bodyObject) {
  ensureWechatPaymentConfig();
  const body = bodyObject ? JSON.stringify(bodyObject) : "";
  const response = await fetch(`${WECHAT_API}${urlPath}`, {
    method,
    headers: {
      Accept: "application/json",
      Authorization: sign(method, urlPath, body),
      "Content-Type": "application/json",
      "User-Agent": "paw-natural-treats/1.0"
    },
    body: body || undefined
  });
  const text = await response.text();
  const data = text ? JSON.parse(text) : {};
  if (!response.ok) {
    const error = new Error(data.message || "微信支付接口调用失败");
    error.code = "WECHAT_API_ERROR";
    error.statusCode = response.status;
    error.data = data;
    throw error;
  }
  return data;
}

async function createWechatPayload(order, channel, baseUrl, req) {
  const isH5 = channel === "h5";
  const isJsapi = channel === "jsapi";

  let urlPath;
  if (isJsapi) urlPath = "/v3/pay/transactions/jsapi";
  else if (isH5) urlPath = "/v3/pay/transactions/h5";
  else urlPath = "/v3/pay/transactions/native";

  const body = {
    appid: isJsapi ? (process.env.WECHAT_MP_APP_ID || process.env.WECHAT_APP_ID) : process.env.WECHAT_APP_ID,
    mchid: process.env.WECHAT_MCH_ID,
    description: `爪味自然订单 ${order.id}`,
    out_trade_no: order.id,
    notify_url: process.env.WECHAT_NOTIFY_URL || `${baseUrl}/api/webhooks/wechat`,
    amount: {
      total: order.amountCents,
      currency: "CNY"
    }
  };

  if (isJsapi) {
    const openid = req.body?.openid || req.query?.openid;
    if (!openid) {
      const error = new Error("JSAPI 支付需要用户 openid");
      error.code = "MISSING_OPENID";
      throw error;
    }
    body.payer = { openid };
  }

  if (isH5) {
    body.scene_info = {
      payer_client_ip: getClientIp(req),
      h5_info: { type: "Wap" }
    };
  }
  const data = await wechatFetch("POST", urlPath, body);

  if (isJsapi) {
    // Return parameters for WeixinJSBridge.invoke('getBrandWCPayRequest', ...)
    const appId = process.env.WECHAT_MP_APP_ID || process.env.WECHAT_APP_ID;
    const timeStamp = Math.floor(Date.now() / 1000).toString();
    const nonceStr = nonce();
    const packageStr = `prepay_id=${data.prepay_id}`;
    const message = `${appId}\n${timeStamp}\n${nonceStr}\n${packageStr}\n`;
    const paySign = crypto.createSign("RSA-SHA256").update(message).sign(privateKey(), "base64");
    return {
      provider: "wechat",
      channel: "jsapi",
      type: "jsapi",
      mode: "jsapi",
      appId,
      timeStamp,
      nonceStr,
      package: packageStr,
      signType: "RSA",
      paySign
    };
  }

  if (isH5) {
    return {
      provider: "wechat",
      channel,
      type: "redirect",
      mode: "redirect",
      url: data.h5_url,
      paymentUrl: data.h5_url
    };
  }
  const qrCodeDataUrl = await QRCode.toDataURL(data.code_url, { margin: 1, width: 260 });
  return {
    provider: "wechat",
    channel,
    type: "qrcode",
    mode: "qrcode",
    codeUrl: data.code_url,
    qrCodeDataUrl,
    qrDataUrl: qrCodeDataUrl
  };
}

function mapWechatState(tradeState) {
  if (tradeState === "SUCCESS") return "PAID";
  if (["CLOSED", "REVOKED", "PAYERROR"].includes(tradeState)) return "CLOSED";
  return "PENDING_PAYMENT";
}

async function queryWechat(order) {
  const urlPath = `/v3/pay/transactions/out-trade-no/${encodeURIComponent(order.id)}?mchid=${encodeURIComponent(process.env.WECHAT_MCH_ID)}`;
  return wechatFetch("GET", urlPath);
}

async function closeWechat(order) {
  const urlPath = `/v3/pay/transactions/out-trade-no/${encodeURIComponent(order.id)}/close`;
  return wechatFetch("POST", urlPath, { mchid: process.env.WECHAT_MCH_ID });
}

function verifyWechatSignature(req, rawBody) {
  requiredEnv(["WECHAT_PLATFORM_CERT_SERIAL_NO", "WECHAT_PLATFORM_CERT_PUBLIC_KEY"]);
  const signature = req.headers["wechatpay-signature"];
  const timestamp = req.headers["wechatpay-timestamp"];
  const nonceStr = req.headers["wechatpay-nonce"];
  const serial = req.headers["wechatpay-serial"];
  if (serial !== process.env.WECHAT_PLATFORM_CERT_SERIAL_NO) return false;
  const message = `${timestamp}\n${nonceStr}\n${rawBody.toString("utf8")}\n`;
  return crypto.createVerify("RSA-SHA256").update(message).verify(platformPublicKey(), signature, "base64");
}

function decryptWechatResource(resource) {
  requiredEnv(["WECHAT_API_V3_KEY"]);
  const ciphertext = Buffer.from(resource.ciphertext, "base64");
  const authTag = ciphertext.subarray(ciphertext.length - 16);
  const encrypted = ciphertext.subarray(0, ciphertext.length - 16);
  const decipher = crypto.createDecipheriv(
    "aes-256-gcm",
    Buffer.from(process.env.WECHAT_API_V3_KEY, "utf8"),
    Buffer.from(resource.nonce, "utf8")
  );
  decipher.setAuthTag(authTag);
  if (resource.associated_data) decipher.setAAD(Buffer.from(resource.associated_data, "utf8"));
  return JSON.parse(Buffer.concat([decipher.update(encrypted), decipher.final()]).toString("utf8"));
}

module.exports = {
  closeWechat,
  createWechatPayload,
  decryptWechatResource,
  mapWechatState,
  queryWechat,
  verifyWechatSignature
};
