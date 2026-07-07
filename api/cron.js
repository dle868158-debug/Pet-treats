const { closeAlipay } = require("../server/lib/alipay");
const { closeWechat } = require("../server/lib/wechat");
const { listOrders, markClosed } = require("../server/lib/orders");
const { sendJson } = require("../server/lib/http");

async function closeUpstream(order) {
  try {
    if (order.paymentProvider === "alipay") await closeAlipay(order);
    if (order.paymentProvider === "wechat") await closeWechat(order);
  } catch {
    // Upstream close is best-effort — the order still gets marked closed locally.
  }
}

module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    return sendJson(res, 405, { ok: false, error: "METHOD_NOT_ALLOWED" });
  }

  // Vercel Cron sends Authorization: Bearer <CRON_SECRET>
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && req.headers.authorization !== `Bearer ${cronSecret}`) {
    return sendJson(res, 401, { ok: false, error: "UNAUTHORIZED" });
  }

  try {
    const orders = await listOrders(500);
    const now = Date.now();
    let closed = 0;

    for (const order of orders) {
      if (order.status !== "PENDING_PAYMENT") continue;
      if (!order.expiresAt || new Date(order.expiresAt).getTime() > now) continue;
      await closeUpstream(order);
      await markClosed(order, { closeReason: "expired" });
      closed++;
    }

    return sendJson(res, 200, { ok: true, closed, checked: orders.length });
  } catch (error) {
    return sendJson(res, 500, {
      ok: false,
      error: error.code || "CRON_FAILED",
      message: error.message
    });
  }
};
