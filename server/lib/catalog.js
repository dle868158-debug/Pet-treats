const DEFAULT_PRODUCTS = [
  { id: "chicken-strips", name: "慢烘鸡胸肉条", category: "鸡肉", priceCents: 5900 },
  { id: "freeze-dried-duo", name: "冻干双拼肉粒", category: "冻干", priceCents: 7600 },
  { id: "dental-chews", name: "鼠尾草洁齿咀嚼棒", category: "洁齿", priceCents: 6800 },
  { id: "training-bites", name: "一口训练小方", category: "训练奖励", priceCents: 4900 },
  { id: "cat-salmon-crisps", name: "猫用鲑鱼冻干脆", category: "冻干", priceCents: 7200 },
  { id: "dog-beef-chew-sticks", name: "犬用牛肉洁齿棒", category: "洁齿", priceCents: 8800 }
];

function getProduct(productId) {
  return DEFAULT_PRODUCTS.find((product) => product.id === productId) || null;
}

function calculateItems(cartItems = []) {
  if (!Array.isArray(cartItems) || cartItems.length === 0) {
    const error = new Error("购物车为空");
    error.code = "EMPTY_CART";
    throw error;
  }

  const items = cartItems.map((item) => {
    const product = getProduct(item.productId);
    const quantity = Math.max(0, Math.floor(Number(item.quantity) || 0));
    if (!product || quantity < 1) {
      const error = new Error("商品不存在或数量无效");
      error.code = "INVALID_CART_ITEM";
      throw error;
    }
    return {
      productId: product.id,
      name: product.name,
      category: product.category,
      price: product.priceCents / 100,
      priceCents: product.priceCents,
      quantity,
      lineAmountCents: product.priceCents * quantity
    };
  });

  return {
    items,
    amountCents: items.reduce((sum, item) => sum + item.lineAmountCents, 0)
  };
}

module.exports = { DEFAULT_PRODUCTS, calculateItems, getProduct };
