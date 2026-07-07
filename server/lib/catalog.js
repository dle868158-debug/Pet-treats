const { getProductFromStore, DEFAULT_PRODUCTS } = require("./product-store");

// Synchronous fallback for when Redis is unavailable
const FALLBACK_MAP = new Map(DEFAULT_PRODUCTS.map((p) => [p.id, p]));

function getProduct(productId) {
  return FALLBACK_MAP.get(productId) || null;
}

async function getProductAsync(productId) {
  try {
    const product = await getProductFromStore(productId);
    if (product) return product;
  } catch {
    // Fall back to hardcoded defaults on Redis failure.
  }
  return getProduct(productId);
}

async function calculateItems(cartItems = []) {
  if (!Array.isArray(cartItems) || cartItems.length === 0) {
    const error = new Error("购物车为空");
    error.code = "EMPTY_CART";
    throw error;
  }

  const items = [];
  for (const item of cartItems) {
    const product = await getProductAsync(item.productId);
    const quantity = Math.max(0, Math.floor(Number(item.quantity) || 0));
    if (!product || quantity < 1) {
      const error = new Error("商品不存在或数量无效");
      error.code = "INVALID_CART_ITEM";
      throw error;
    }
    const priceCents = product.priceCents || Math.round((product.price || 0) * 100);
    items.push({
      productId: product.id,
      name: product.name,
      category: product.category,
      price: priceCents / 100,
      priceCents,
      quantity,
      lineAmountCents: priceCents * quantity
    });
  }

  return {
    items,
    amountCents: items.reduce((sum, item) => sum + item.lineAmountCents, 0)
  };
}

module.exports = { DEFAULT_PRODUCTS, calculateItems, getProduct, getProductAsync };
