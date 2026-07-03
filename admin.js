const PRODUCTS_KEY = "pawNaturalProducts";
const ORDERS_KEY = "pawNaturalOrders";

const defaultProducts = [
  {
    id: "chicken-strips",
    name: "慢烘鸡胸肉条",
    category: "鸡肉",
    petTypes: ["cat", "dog"],
    price: 59,
    sales: 2680,
    weight: "120g",
    image: "assets/product-chicken-strips.png",
    tags: ["高蛋白", "低脂", "猫狗通用"],
    ingredients: "鸡胸肉、少量南瓜粉、迷迭香提取物",
    suitability: "适合日常奖励、训练后补充；幼宠建议剪成小段。",
    palatability: "柔韧肉感，香气温和，适合偏爱肉条口感的宠物。",
    description: "低温慢烘保留鸡肉纤维，方便掰分，适合日常奖励和训练时快速投喂。"
  },
  {
    id: "freeze-dried-duo",
    name: "冻干双拼肉粒",
    category: "冻干",
    petTypes: ["cat", "dog"],
    price: 76,
    sales: 1846,
    weight: "95g",
    image: "assets/product-freeze-dried.png",
    tags: ["冻干", "挑食友好", "拌粮"],
    ingredients: "牛肉、鳕鱼、鸡肝冻干粉",
    suitability: "适合挑食、拌粮和外出携带；饮水少的宠物建议搭配清水。",
    palatability: "入口酥松，肉香明显，可捏碎撒在主粮上提升适口性。",
    description: "牛肉与鳕鱼双蛋白组合，冻干工艺带来轻盈酥脆口感，适合挑食宠物。"
  },
  {
    id: "dental-chews",
    name: "鼠尾草洁齿咀嚼棒",
    category: "洁齿",
    petTypes: ["dog"],
    price: 68,
    sales: 1265,
    weight: "7支装",
    image: "assets/product-dental-chews.png",
    tags: ["洁齿", "耐嚼", "清新口气"],
    ingredients: "豌豆纤维、鸡肉粉、鼠尾草、欧芹、椰子油",
    suitability: "适合成犬和咀嚼能力较好的猫狗；请在看护下喂食。",
    palatability: "外层带植物清香，内部保留肉粉香气，兼顾咀嚼和接受度。",
    description: "纤维纹理帮助摩擦牙面，鼠尾草与欧芹带来清新气息，适合餐后奖励。"
  },
  {
    id: "training-bites",
    name: "一口训练小方",
    category: "训练奖励",
    petTypes: ["cat", "dog"],
    price: 49,
    sales: 3218,
    weight: "150g",
    image: "assets/product-training-bites.png",
    tags: ["小颗粒", "控量", "训练奖励"],
    ingredients: "鸭肉、燕麦、胡萝卜、亚麻籽",
    suitability: "适合训练、召回、剪指甲和外出安抚；小型宠物也容易咀嚼。",
    palatability: "小颗粒不油手，香气集中，适合高频少量奖励。",
    description: "小尺寸方便控制热量，鸭肉与燕麦带来柔和口感，是训练场景的稳定选择。"
  },
  {
    id: "cat-salmon-crisps",
    name: "猫用鲑鱼冻干脆",
    category: "冻干",
    petTypes: ["cat"],
    price: 72,
    sales: 1420,
    weight: "80g",
    image: "assets/product-freeze-dried.png",
    tags: ["猫猫适用", "冻干", "拌粮"],
    ingredients: "鲑鱼、鸡胸肉、蛋黄粉、牛磺酸",
    suitability: "适合猫咪日常加餐、拌粮和挑食改善；建议搭配清水喂食。",
    palatability: "鱼香更明显，颗粒酥松，方便捏碎后拌入主粮。",
    description: "面向猫咪设计的冻干小脆粒，兼顾肉香、鱼香和拌粮场景。"
  },
  {
    id: "dog-beef-chew-sticks",
    name: "犬用牛肉洁齿棒",
    category: "洁齿",
    petTypes: ["dog"],
    price: 88,
    sales: 1736,
    weight: "10支装",
    image: "assets/product-dental-chews.png",
    tags: ["狗狗适用", "洁齿", "耐嚼"],
    ingredients: "牛肉粉、豌豆纤维、红薯粉、欧芹、椰子油",
    suitability: "适合成犬餐后咀嚼和口腔护理；请根据体型控制单次喂食量。",
    palatability: "牛肉香气更厚，咀嚼阻力适中，适合需要耐嚼奖励的狗狗。",
    description: "犬用耐嚼洁齿棒，帮助延长咀嚼时间，也适合餐后作为口腔护理奖励。"
  }
];

const demoOrders = [
  {
    id: "DEMO-240731",
    createdAt: "2026-07-02T09:18:00.000Z",
    customer: { name: "周女士", email: "demo-customer-1@example.com" },
    address: { receiver: "周女士", phone: "13800000001", region: "湖北省 武汉市", detail: "洪山区演示小区 8 栋", note: "工作日配送" },
    items: [
      { productId: "training-bites", name: "一口训练小方", price: 49, quantity: 3 },
      { productId: "freeze-dried-duo", name: "冻干双拼肉粒", price: 76, quantity: 1 }
    ],
    total: 223,
    status: "待配送"
  },
  {
    id: "DEMO-240726",
    createdAt: "2026-07-01T14:42:00.000Z",
    customer: { name: "陈先生", email: "demo-customer-2@example.com" },
    address: { receiver: "陈先生", phone: "13800000002", region: "湖北省 武汉市", detail: "青山区演示路 16 号", note: "" },
    items: [
      { productId: "chicken-strips", name: "慢烘鸡胸肉条", price: 59, quantity: 2 },
      { productId: "dental-chews", name: "鼠尾草洁齿咀嚼棒", price: 68, quantity: 2 }
    ],
    total: 254,
    status: "待配送"
  },
  {
    id: "DEMO-240719",
    createdAt: "2026-06-30T07:36:00.000Z",
    customer: { name: "林女士", email: "demo-customer-3@example.com" },
    address: { receiver: "林女士", phone: "13800000003", region: "湖北省 武汉市", detail: "江岸区演示街 23 号", note: "门卫代收" },
    items: [
      { productId: "dog-beef-chew-sticks", name: "犬用牛肉洁齿棒", price: 88, quantity: 1 },
      { productId: "cat-salmon-crisps", name: "猫用鲑鱼冻干脆", price: 72, quantity: 2 }
    ],
    total: 232,
    status: "待配送"
  }
];

const metricsNode = document.querySelector("[data-admin-metrics]");
const rankingNode = document.querySelector("[data-ranking-list]");
const productSalesNode = document.querySelector("[data-product-sales]");
const orderListNode = document.querySelector("[data-order-list]");
const productForm = document.querySelector("[data-product-form]");
const adminMessage = document.querySelector("[data-admin-message]");
let realPaymentOrders = [];

function formatCurrency(value) {
  return new Intl.NumberFormat("zh-CN", {
    style: "currency",
    currency: "CNY",
    maximumFractionDigits: 0
  }).format(value);
}

function formatNumber(value) {
  return new Intl.NumberFormat("zh-CN").format(value);
}

function formatDate(value) {
  return new Intl.DateTimeFormat("zh-CN", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function loadCollection(key) {
  try {
    const data = JSON.parse(localStorage.getItem(key)) || [];
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function saveProducts(products) {
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
}

function normalizeProduct(product) {
  return {
    ...product,
    price: Number(product.price) || 0,
    sales: Number(product.sales) || 0,
    petTypes: Array.isArray(product.petTypes) ? product.petTypes : [],
    tags: Array.isArray(product.tags) ? product.tags : []
  };
}

function getProducts() {
  const mergedProducts = new Map(defaultProducts.map((product) => [product.id, normalizeProduct(product)]));
  loadCollection(PRODUCTS_KEY).forEach((product) => {
    if (product.id) mergedProducts.set(product.id, normalizeProduct(product));
  });
  return [...mergedProducts.values()];
}

function getOrders() {
  return [...realPaymentOrders, ...loadCollection(ORDERS_KEY), ...demoOrders].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
}

function getProductMap(products) {
  return new Map(products.map((product) => [product.id, product]));
}

function summarizeSales(products, orders) {
  const productMap = getProductMap(products);
  const summaries = new Map(
    products.map((product) => [
      product.id,
      {
        product,
        units: 0,
        revenue: 0
      }
    ])
  );

  orders.forEach((order) => {
    order.items.forEach((item) => {
      const product = productMap.get(item.productId) || {
        id: item.productId,
        name: item.name,
        category: "历史商品",
        price: item.price
      };
      if (!summaries.has(product.id)) {
        summaries.set(product.id, { product, units: 0, revenue: 0 });
      }
      const summary = summaries.get(product.id);
      const quantity = Number(item.quantity) || 0;
      const price = Number(item.price ?? product.price) || 0;
      summary.units += quantity;
      summary.revenue += price * quantity;
    });
  });

  return [...summaries.values()].sort((a, b) => b.units - a.units || b.revenue - a.revenue);
}

function renderMetrics(orders, salesSummaries) {
  const totalRevenue = orders.reduce((sum, order) => sum + (Number(order.total) || 0), 0);
  const totalUnits = salesSummaries.reduce((sum, summary) => sum + summary.units, 0);
  const activeProducts = salesSummaries.filter((summary) => summary.units > 0).length;
  const topProduct = salesSummaries.find((summary) => summary.units > 0)?.product.name || "暂无";

  const metrics = [
    { label: "总营业额", value: formatCurrency(totalRevenue), note: "真实订单与演示订单合计" },
    { label: "订单数", value: formatNumber(orders.length), note: "含本地真实订单" },
    { label: "售出件数", value: formatNumber(totalUnits), note: `${activeProducts} 个商品产生销量` },
    { label: "销量冠军", value: topProduct, note: "按订单件数排序" }
  ];

  metricsNode.innerHTML = metrics
    .map(
      (metric) => `
        <article class="metric-card">
          <span>${metric.label}</span>
          <strong>${metric.value}</strong>
          <p>${metric.note}</p>
        </article>
      `
    )
    .join("");
}

function renderRanking(salesSummaries) {
  const rankedProducts = salesSummaries.filter((summary) => summary.units > 0).slice(0, 5);
  rankingNode.innerHTML = rankedProducts.length
    ? rankedProducts
        .map(
          (summary, index) => `
            <article class="ranking-item">
              <span class="ranking-index">${index + 1}</span>
              <div>
                <strong>${escapeHtml(summary.product.name)}</strong>
                <p>${escapeHtml(summary.product.category)} · ${formatNumber(summary.units)} 件 · ${formatCurrency(summary.revenue)}</p>
              </div>
            </article>
          `
        )
        .join("")
    : '<div class="empty-state compact"><p>暂无商品销售数据。</p></div>';
}

function renderProductSales(salesSummaries) {
  productSalesNode.innerHTML = salesSummaries
    .map(
      (summary) => `
        <tr>
          <td>${escapeHtml(summary.product.name)}</td>
          <td>${escapeHtml(summary.product.category)}</td>
          <td>${formatNumber(summary.units)}</td>
          <td>${formatCurrency(summary.revenue)}</td>
        </tr>
      `
    )
    .join("");
}

function formatOrderStatus(status) {
  const statusMap = {
    PENDING_PAYMENT: "待支付",
    PAID: "已支付",
    CLOSED: "已关闭",
    FAILED: "支付失败"
  };
  return statusMap[status] || status || "待配送";
}

function renderOrders(orders) {
  orderListNode.innerHTML = orders
    .map(
      (order) => `
        <tr>
          <td><strong>${escapeHtml(order.id)}</strong>${order.source === "real" ? '<br><span class="source-badge">真实支付</span>' : ""}</td>
          <td>${formatDate(order.createdAt)}</td>
          <td>${escapeHtml(order.customer?.name || "演示用户")}<br><span>${escapeHtml(order.customer?.email || "")}</span></td>
          <td>${escapeHtml(order.address?.receiver || "")} ${escapeHtml(order.address?.phone || "")}<br><span>${escapeHtml(order.address?.region || "")} ${escapeHtml(order.address?.detail || "")}</span></td>
          <td>${order.items.map((item) => `${escapeHtml(item.name)} x ${formatNumber(item.quantity)}`).join("<br>")}</td>
          <td>${formatCurrency(order.total)}</td>
          <td><span class="status-badge">${escapeHtml(formatOrderStatus(order.status))}</span></td>
        </tr>
      `
    )
    .join("");
}

function renderDashboard() {
  const products = getProducts();
  const orders = getOrders();
  const salesSummaries = summarizeSales(products, orders);

  renderMetrics(orders, salesSummaries);
  renderRanking(salesSummaries);
  renderProductSales(salesSummaries);
  renderOrders(orders);
}

function slugify(value) {
  const slug = String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || `product-${Date.now()}`;
}

function getProductFromForm(form) {
  const data = new FormData(form);
  const name = String(data.get("name") || "").trim();
  const category = String(data.get("category") || "").trim();
  const petTypes = data.getAll("petTypes");
  const tags = String(data.get("tags") || "")
    .split(/[,，]/)
    .map((tag) => tag.trim())
    .filter(Boolean);

  return {
    id: `${slugify(name)}-${Date.now().toString().slice(-5)}`,
    name,
    category,
    petTypes,
    price: Number(data.get("price")) || 0,
    sales: Number(data.get("sales")) || 0,
    weight: String(data.get("weight") || "").trim(),
    image: String(data.get("image") || "").trim(),
    tags,
    ingredients: String(data.get("ingredients") || "").trim(),
    suitability: String(data.get("suitability") || "").trim(),
    palatability: String(data.get("palatability") || "").trim(),
    description: String(data.get("description") || "").trim()
  };
}

function getMissingProductFields(product) {
  const fields = [
    ["name", "商品名称"],
    ["category", "食品分类"],
    ["weight", "规格"],
    ["image", "商品图片"],
    ["ingredients", "主要成分"],
    ["suitability", "适用建议"],
    ["palatability", "适口性"],
    ["description", "商品简介"]
  ];
  const missingFields = fields.filter(([key]) => !product[key]).map(([, label]) => label);
  if (product.price <= 0) missingFields.push("价格");
  if (!product.petTypes.length) missingFields.push("适用宠物");
  return missingFields;
}

function showMessage(message, type = "info") {
  adminMessage.textContent = message;
  adminMessage.dataset.type = type;
}

async function loadRealPaymentOrders(token) {
  const response = await fetch("/api/orders/list", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok || !result.ok) {
    throw new Error(result.message || "真实订单读取失败。");
  }
  realPaymentOrders = result.orders || [];
  renderDashboard();
  showMessage(`已加载 ${formatNumber(realPaymentOrders.length)} 条真实支付订单。`, "success");
}

function setupRealOrderLoader() {
  const actions = document.querySelector(".admin-hero-actions");
  if (actions) {
    const button = document.createElement("button");
    button.className = "plain-button";
    button.type = "button";
    button.textContent = "加载真实订单";
    button.addEventListener("click", async () => {
      const token = window.prompt("请输入后台订单 token");
      if (!token) return;
      sessionStorage.setItem("pawNaturalAdminToken", token);
      try {
        await loadRealPaymentOrders(token);
      } catch (error) {
        showMessage(error.message, "error");
      }
    });
    actions.appendChild(button);
  }

  const savedToken = sessionStorage.getItem("pawNaturalAdminToken");
  if (savedToken) {
    loadRealPaymentOrders(savedToken).catch(() => {
      sessionStorage.removeItem("pawNaturalAdminToken");
    });
  }
}

productForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const product = getProductFromForm(productForm);
  const missingFields = getMissingProductFields(product);

  if (missingFields.length) {
    showMessage(`请补充：${missingFields.join("、")}`, "error");
    return;
  }

  const storedProducts = loadCollection(PRODUCTS_KEY);
  saveProducts([product, ...storedProducts]);
  productForm.reset();
  productForm.elements.sales.value = "0";
  productForm.querySelectorAll('input[name="petTypes"]').forEach((input) => {
    input.checked = true;
  });
  showMessage("新品已上架，刷新前台即可看到。", "success");
  renderDashboard();
});

setupRealOrderLoader();
renderDashboard();
