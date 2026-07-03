const { createOrder } = require("./lib/orders");
const { methodNotAllowed, readJson, sendJson } = require("./lib/http");

function handleError(res, error) {
  const status = error.code === "PAYMENT_CONFIG_MISSING" ? 503 : 400;
  sendJson(res, status, { ok: false, error: error.code || "ORDER_CREATE_FAILED", message: error.message, missing: error.missing });
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") return methodNotAllowed(res, ["POST"]);
  try {
    const body = await readJson(req);
    const order = await createOrder({
      cartItems: body.items || body.cartItems || [],
      customer: body.customer || {},
      address: body.address || {}
    });
    sendJson(res, 200, { ok: true, order });
  } catch (error) {
    handleError(res, error);
  }
};
