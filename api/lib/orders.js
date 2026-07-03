const crypto = require("crypto");
const { redis } = require("./redis");
const { calculateItems } = require("./catalog");

const ORDER_LIST_KEY = "paw:orders";
const ORDER_PREFIX = "paw:order:";
const PAYMENT_PREFIX = "paw:payment:";
const WEBHOOK_PREFIX = "paw:webhook:";

function nowIso() {
  return new Date().toISOString();
}

function newOrderId() {
  return `PN${Date.now()}${crypto.randomBytes(3).toString("hex").toUpperCase()}`;
}

function normalizeAddress(address = {}) {
  return {
    receiver: String(address.receiver || "").trim(),
    phone: String(address.phone || "").trim(),
    region: String(address.region || "").trim(),
    detail: String(address.detail || "").trim(),
    note: String(address.note || "").trim()
  };
}

function validateAddress(address) {
  return Boolean(address.receiver && address.phone && address.region && address.detail);
}

async function createOrder({ cartItems, customer, address }) {
  const calculated = calculateItems(cartItems);
  const normalizedAddress = normalizeAddress(address);
  if (!validateAddress(normalizedAddress)) {
    const error = new Error("收货地址不完整");
    error.code = "INVALID_ADDRESS";
    throw error;
  }

  const createdAt = nowIso();
  const order = {
    id: newOrderId(),
    source: "real",
    status: "PENDING_PAYMENT",
    paymentStatus: "PENDING_PAYMENT",
    paymentProvider: null,
    paymentChannel: null,
    platformTradeNo: null,
    currency: "CNY",
    amountCents: calculated.amountCents,
    total: calculated.amountCents / 100,
    items: calculated.items,
    customer: {
      name: String(customer?.name || customer?.email || "客户").trim(),
      email: String(customer?.email || "").trim()
    },
    address: normalizedAddress,
    createdAt,
    updatedAt: createdAt,
    expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString()
  };

  await redis().set(`${ORDER_PREFIX}${order.id}`, order);
  await redis().lpush(ORDER_LIST_KEY, order.id);
  return order;
}

async function getOrder(orderId) {
  if (!orderId) return null;
  return redis().get(`${ORDER_PREFIX}${orderId}`);
}

async function saveOrder(order) {
  const updated = { ...order, updatedAt: nowIso() };
  await redis().set(`${ORDER_PREFIX}${order.id}`, updated);
  return updated;
}

async function listOrders(limit = 100) {
  const ids = await redis().lrange(ORDER_LIST_KEY, 0, Math.max(0, limit - 1));
  if (!ids?.length) return [];
  const orders = await Promise.all(ids.map((id) => getOrder(id)));
  return orders.filter(Boolean);
}

async function savePayment(orderId, payment) {
  const payload = { ...payment, orderId, updatedAt: nowIso() };
  await redis().set(`${PAYMENT_PREFIX}${payment.provider}:${orderId}`, payload);
  const order = await getOrder(orderId);
  if (order) {
    await saveOrder({
      ...order,
      paymentProvider: payment.provider,
      paymentChannel: payment.channel,
      lastPayment: payload
    });
  }
  return payload;
}

async function markPaid(order, updates = {}) {
  if (order.status === "PAID") return order;
  return saveOrder({
    ...order,
    ...updates,
    status: "PAID",
    paymentStatus: "PAID",
    paidAt: updates.paidAt || nowIso()
  });
}

async function markClosed(order, updates = {}) {
  if (order.status === "PAID") return order;
  return saveOrder({
    ...order,
    ...updates,
    status: "CLOSED",
    paymentStatus: "CLOSED",
    closedAt: updates.closedAt || nowIso()
  });
}

async function recordWebhook(provider, eventId, payload) {
  const key = `${WEBHOOK_PREFIX}${provider}:${eventId}`;
  const existing = await redis().get(key);
  if (existing) return false;
  await redis().set(key, { provider, eventId, payload, createdAt: nowIso() }, { ex: 60 * 60 * 24 * 7 });
  return true;
}

module.exports = {
  createOrder,
  getOrder,
  listOrders,
  markClosed,
  markPaid,
  recordWebhook,
  saveOrder,
  savePayment
};
