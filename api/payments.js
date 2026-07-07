const { createAlipayPayload, queryAlipay } = require("../server/lib/alipay");
const { createWechatPayload, mapWechatState, queryWechat } = require("../server/lib/wechat");
const { getBaseUrl, methodNotAllowed, readJson, sendJson } = require("../server/lib/http");
const { getOrder, markClosed, markPaid, savePayment } = require("../server/lib/orders");
const { rateLimit } = require("../server/lib/rate-limit");

async function syncAlipayOrder(order) {
  const result = await queryAlipay(order);
  const data = result?.data || result;
  const tradeStatus = data?.trade_status || data?.tradeStatus;
  if (["TRADE_SUCCESS", "TRADE_FINISHED"].includes(tradeStatus)) {
    return markPaid(order, { paymentProvider: "alipay", platformTradeNo: data.trade_no || data.tradeNo });
  }
  if (tradeStatus === "TRADE_CLOSED") {
    return markClosed(order, { paymentProvider: "alipay", platformTradeNo: data.trade_no || data.tradeNo });
  }
  return order;
}

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

async function handleStatus(req, res) {
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
    return sendJson(res, 200, {
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
    return sendJson(res, error.code === "PAYMENT_CONFIG_MISSING" ? 503 : 400, {
      ok: false,
      error: error.code || "PAYMENT_STATUS_FAILED",
      message: error.message,
      missing: error.missing
    });
  }
}

async function handleQuery(req, res, provider) {
  if (req.method !== "POST") return methodNotAllowed(res, ["POST"]);
  try {
    const { orderId } = await readJson(req);
    const order = await getOrder(orderId);
    if (!order) return sendJson(res, 404, { ok: false, error: "ORDER_NOT_FOUND" });
    const updated = provider === "wechat" ? await syncWechatOrder(order) : await syncAlipayOrder(order);
    return sendJson(res, 200, { ok: true, order: updated });
  } catch (error) {
    return sendJson(res, error.code === "PAYMENT_CONFIG_MISSING" ? 503 : error.statusCode || 400, {
      ok: false,
      error: provider === "wechat" ? "WECHAT_QUERY_FAILED" : "ALIPAY_QUERY_FAILED",
      message: error.message,
      missing: error.missing,
      data: error.data
    });
  }
}

async function handleCreate(req, res, provider) {
  if (req.method !== "POST") return methodNotAllowed(res, ["POST"]);
  try {
    const body = await readJson(req);
    const { orderId, channel } = body;
    const order = await getOrder(orderId);
    if (!order) return sendJson(res, 404, { ok: false, error: "ORDER_NOT_FOUND" });
    if (order.status === "PAID") return sendJson(res, 409, { ok: false, error: "ORDER_ALREADY_PAID" });
    if (order.status === "CLOSED") return sendJson(res, 409, { ok: false, error: "ORDER_CLOSED" });
    const wechatChannel = channel === "h5" ? "h5" : channel === "jsapi" ? "jsapi" : "native";
    const reqWithBody = { ...req, body };
    const payment =
      provider === "wechat"
        ? await createWechatPayload(order, wechatChannel, getBaseUrl(req), reqWithBody)
        : createAlipayPayload(order, channel === "wap" ? "wap" : "pc", getBaseUrl(req));
    await savePayment(order.id, payment);
    return sendJson(res, 200, { ok: true, order, payment });
  } catch (error) {
    return sendJson(res, error.code === "PAYMENT_CONFIG_MISSING" ? 503 : error.statusCode || 400, {
      ok: false,
      error: provider === "wechat" ? "WECHAT_CREATE_FAILED" : "ALIPAY_CREATE_FAILED",
      message: error.message,
      missing: error.missing,
      data: error.data
    });
  }
}

module.exports = async function handler(req, res) {
  const action = req.query?.action || "status";
  const provider = req.query?.provider;
  if (action === "status") return handleStatus(req, res);
  if (!["alipay", "wechat"].includes(provider)) return sendJson(res, 404, { ok: false, error: "PAYMENT_PROVIDER_NOT_FOUND" });
  if (action === "create") {
    if (await rateLimit(req, res, { prefix: "pay", limit: 10, windowSec: 60 })) return;
    return handleCreate(req, res, provider);
  }
  if (action === "query") return handleQuery(req, res, provider);
  return sendJson(res, 404, { ok: false, error: "PAYMENT_ACTION_NOT_FOUND" });
};
