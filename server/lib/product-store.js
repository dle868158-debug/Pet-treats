const { redis } = require("./redis");

const PRODUCT_LIST_KEY = "paw:products";
const PRODUCT_PREFIX = "paw:product:";

const DEFAULT_PRODUCTS = [
  {
    id: "chicken-strips", name: "慢烘鸡胸肉条", category: "鸡肉",
    petTypes: ["cat", "dog"], price: 59, priceCents: 5900, sales: 2680, weight: "120g",
    image: "assets/product-chicken-strips.png",
    tags: ["高蛋白", "低脂", "猫狗通用"],
    ingredients: "鸡胸肉、少量南瓜粉、迷迭香提取物",
    suitability: "适合日常奖励、训练后补充；幼宠建议剪成小段。",
    palatability: "柔韧肉感，香气温和，适合偏爱肉条口感的宠物。",
    description: "低温慢烘保留鸡肉纤维，方便掰分，适合日常奖励和训练时快速投喂。"
  },
  {
    id: "freeze-dried-duo", name: "冻干双拼肉粒", category: "冻干",
    petTypes: ["cat", "dog"], price: 76, priceCents: 7600, sales: 1846, weight: "95g",
    image: "assets/product-freeze-dried.png",
    tags: ["冻干", "挑食友好", "拌粮"],
    ingredients: "牛肉、鳕鱼、鸡肝冻干粉",
    suitability: "适合挑食、拌粮和外出携带；饮水少的宠物建议搭配清水。",
    palatability: "入口酥松，肉香明显，可捏碎撒在主粮上提升适口性。",
    description: "牛肉与鳕鱼双蛋白组合，冻干工艺带来轻盈酥脆口感，适合挑食宠物。"
  },
  {
    id: "dental-chews", name: "鼠尾草洁齿咀嚼棒", category: "洁齿",
    petTypes: ["dog"], price: 68, priceCents: 6800, sales: 1265, weight: "7支装",
    image: "assets/product-dental-chews.png",
    tags: ["洁齿", "耐嚼", "清新口气"],
    ingredients: "豌豆纤维、鸡肉粉、鼠尾草、欧芹、椰子油",
    suitability: "适合成犬和咀嚼能力较好的猫狗；请在看护下喂食。",
    palatability: "外层带植物清香，内部保留肉粉香气，兼顾咀嚼和接受度。",
    description: "纤维纹理帮助摩擦牙面，鼠尾草与欧芹带来清新气息，适合餐后奖励。"
  },
  {
    id: "training-bites", name: "一口训练小方", category: "训练奖励",
    petTypes: ["cat", "dog"], price: 49, priceCents: 4900, sales: 3218, weight: "150g",
    image: "assets/product-training-bites.png",
    tags: ["小颗粒", "控量", "训练奖励"],
    ingredients: "鸭肉、燕麦、胡萝卜、亚麻籽",
    suitability: "适合训练、召回、剪指甲和外出安抚；小型宠物也容易咀嚼。",
    palatability: "小颗粒不油手，香气集中，适合高频少量奖励。",
    description: "小尺寸方便控制热量，鸭肉与燕麦带来柔和口感，是训练场景的稳定选择。"
  },
  {
    id: "cat-salmon-crisps", name: "猫用鲑鱼冻干脆", category: "冻干",
    petTypes: ["cat"], price: 72, priceCents: 7200, sales: 1420, weight: "80g",
    image: "assets/product-freeze-dried.png",
    tags: ["猫猫适用", "冻干", "拌粮"],
    ingredients: "鲑鱼、鸡胸肉、蛋黄粉、牛磺酸",
    suitability: "适合猫咪日常加餐、拌粮和挑食改善；建议搭配清水喂食。",
    palatability: "鱼香更明显，颗粒酥松，方便捏碎后拌入主粮。",
    description: "面向猫咪设计的冻干小脆粒，兼顾肉香、鱼香和拌粮场景。"
  },
  {
    id: "dog-beef-chew-sticks", name: "犬用牛肉洁齿棒", category: "洁齿",
    petTypes: ["dog"], price: 88, priceCents: 8800, sales: 1736, weight: "10支装",
    image: "assets/product-dental-chews.png",
    tags: ["狗狗适用", "洁齿", "耐嚼"],
    ingredients: "牛肉粉、豌豆纤维、红薯粉、欧芹、椰子油",
    suitability: "适合成犬餐后咀嚼和口腔护理；请根据体型控制单次喂食量。",
    palatability: "牛肉香气更厚，咀嚼阻力适中，适合需要耐嚼奖励的狗狗。",
    description: "犬用耐嚼洁齿棒，帮助延长咀嚼时间，也适合餐后作为口腔护理奖励。"
  }
];

async function seedProducts() {
  const r = redis();
  const existing = await r.lrange(PRODUCT_LIST_KEY, 0, -1);
  if (existing && existing.length > 0) return;
  for (const product of DEFAULT_PRODUCTS) {
    await r.set(`${PRODUCT_PREFIX}${product.id}`, product);
    await r.rpush(PRODUCT_LIST_KEY, product.id);
  }
}

async function listProducts() {
  const r = redis();
  const ids = await r.lrange(PRODUCT_LIST_KEY, 0, -1);
  if (!ids || ids.length === 0) {
    await seedProducts();
    return DEFAULT_PRODUCTS;
  }
  const products = await Promise.all(ids.map((id) => r.get(`${PRODUCT_PREFIX}${id}`)));
  return products.filter(Boolean);
}

async function getProductFromStore(productId) {
  if (!productId) return null;
  const product = await redis().get(`${PRODUCT_PREFIX}${productId}`);
  if (product) return product;
  // Fallback to defaults
  return DEFAULT_PRODUCTS.find((p) => p.id === productId) || null;
}

async function saveProduct(product) {
  const r = redis();
  await r.set(`${PRODUCT_PREFIX}${product.id}`, product);
  // Add to list if not already present
  const ids = await r.lrange(PRODUCT_LIST_KEY, 0, -1);
  if (!ids.includes(product.id)) {
    await r.rpush(PRODUCT_LIST_KEY, product.id);
  }
  return product;
}

async function deleteProduct(productId) {
  const r = redis();
  await r.del(`${PRODUCT_PREFIX}${productId}`);
  await r.lrem(PRODUCT_LIST_KEY, 0, productId);
}

module.exports = { DEFAULT_PRODUCTS, listProducts, getProductFromStore, saveProduct, deleteProduct, seedProducts };
