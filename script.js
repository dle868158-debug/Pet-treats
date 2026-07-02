const products = [
  {
    id: "chicken-strips",
    name: "慢烘鸡胸肉条",
    category: "鸡肉",
    price: 59,
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
    price: 76,
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
    price: 68,
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
    price: 49,
    weight: "150g",
    image: "assets/product-training-bites.png",
    tags: ["小颗粒", "控量", "训练奖励"],
    ingredients: "鸭肉、燕麦、胡萝卜、亚麻籽",
    suitability: "适合训练、召回、剪指甲和外出安抚；小型宠物也容易咀嚼。",
    palatability: "小颗粒不油手，香气集中，适合高频少量奖励。",
    description: "小尺寸方便控制热量，鸭肉与燕麦带来柔和口感，是训练场景的稳定选择。"
  }
];

const checkoutProvider = {
  async createCheckout(cartItems) {
    await new Promise((resolve) => window.setTimeout(resolve, 450));
    return {
      ok: true,
      orderId: `ZN-${Date.now().toString().slice(-6)}`,
      items: cartItems
    };
  }
};

const state = {
  filter: "all",
  cart: loadCart()
};

const grid = document.querySelector("[data-product-grid]");
const cartDrawer = document.querySelector("[data-cart-drawer]");
const cartItemsNode = document.querySelector("[data-cart-items]");
const cartCountNodes = document.querySelectorAll("[data-cart-count]");
const cartTotalNode = document.querySelector("[data-cart-total]");
const modal = document.querySelector("[data-product-modal]");
const modalBody = document.querySelector("[data-modal-body]");
const toast = document.querySelector("[data-toast]");

function formatCurrency(value) {
  return new Intl.NumberFormat("zh-CN", {
    style: "currency",
    currency: "CNY",
    maximumFractionDigits: 0
  }).format(value);
}

function loadCart() {
  try {
    return JSON.parse(localStorage.getItem("pawNaturalCart")) || [];
  } catch {
    return [];
  }
}

function saveCart() {
  localStorage.setItem("pawNaturalCart", JSON.stringify(state.cart));
}

function getProduct(productId) {
  return products.find((product) => product.id === productId);
}

function getCartQuantity() {
  return state.cart.reduce((sum, item) => sum + item.quantity, 0);
}

function getCartTotal() {
  return state.cart.reduce((sum, item) => {
    const product = getProduct(item.productId);
    return product ? sum + product.price * item.quantity : sum;
  }, 0);
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove("is-visible"), 2400);
}

function renderProducts() {
  const visibleProducts =
    state.filter === "all" ? products : products.filter((product) => product.category === state.filter);

  grid.innerHTML = visibleProducts
    .map(
      (product) => `
        <article class="product-card">
          <img src="${product.image}" alt="${product.name}" loading="lazy">
          <div class="product-content">
            <div class="product-meta">
              ${product.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}
            </div>
            <div class="product-title">
              <h3>${product.name}</h3>
              <span class="price">${formatCurrency(product.price)}</span>
            </div>
            <p class="product-desc">${product.description}</p>
            <div class="card-actions">
              <button class="plain-button" type="button" data-detail="${product.id}">查看详情</button>
              <button class="primary-button" type="button" data-add="${product.id}">加入购物车</button>
            </div>
          </div>
        </article>
      `
    )
    .join("");
}

function renderCart() {
  cartCountNodes.forEach((node) => {
    node.textContent = getCartQuantity();
  });
  cartTotalNode.textContent = formatCurrency(getCartTotal());

  if (!state.cart.length) {
    cartItemsNode.innerHTML = `
      <div class="empty-state">
        <p>购物车还是空的。挑一款天然零食，给下一次奖励留点期待。</p>
      </div>
    `;
    return;
  }

  cartItemsNode.innerHTML = state.cart
    .map((item) => {
      const product = getProduct(item.productId);
      if (!product) return "";
      return `
        <article class="cart-item">
          <img src="${product.image}" alt="${product.name}">
          <div>
            <h3>${product.name}</h3>
            <div>${product.weight} · ${formatCurrency(product.price)}</div>
            <div class="quantity-row">
              <div class="quantity-control" aria-label="${product.name} 数量">
                <button type="button" data-decrease="${product.id}" aria-label="减少数量">−</button>
                <span>${item.quantity}</span>
                <button type="button" data-increase="${product.id}" aria-label="增加数量">+</button>
              </div>
              <button class="remove-button" type="button" data-remove="${product.id}">删除</button>
            </div>
          </div>
        </article>
      `;
    })
    .join("");
}

function addToCart(productId) {
  const current = state.cart.find((item) => item.productId === productId);
  if (current) {
    current.quantity += 1;
  } else {
    state.cart.push({ productId, quantity: 1 });
  }
  saveCart();
  renderCart();
  showToast("已加入购物车");
}

function updateQuantity(productId, delta) {
  const current = state.cart.find((item) => item.productId === productId);
  if (!current) return;
  current.quantity += delta;
  if (current.quantity <= 0) {
    state.cart = state.cart.filter((item) => item.productId !== productId);
  }
  saveCart();
  renderCart();
}

function removeFromCart(productId) {
  state.cart = state.cart.filter((item) => item.productId !== productId);
  saveCart();
  renderCart();
}

function openCart() {
  toast.classList.remove("is-visible");
  cartDrawer.classList.add("is-open");
  cartDrawer.setAttribute("aria-hidden", "false");
}

function closeCart() {
  cartDrawer.classList.remove("is-open");
  cartDrawer.setAttribute("aria-hidden", "true");
}

function openProductModal(productId) {
  const product = getProduct(productId);
  if (!product) return;

  modalBody.innerHTML = `
    <div class="modal-layout">
      <img src="${product.image}" alt="${product.name}">
      <div class="modal-copy">
        <div>
          <p class="eyebrow">${product.category} · ${product.weight}</p>
          <h2 id="modal-title">${product.name}</h2>
        </div>
        <p>${product.description}</p>
        <ul class="detail-list">
          <li><strong>主要成分</strong>${product.ingredients}</li>
          <li><strong>适用建议</strong>${product.suitability}</li>
          <li><strong>适口性</strong>${product.palatability}</li>
        </ul>
        <button class="primary-button full-width" type="button" data-add="${product.id}">加入购物车 · ${formatCurrency(product.price)}</button>
      </div>
    </div>
  `;
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
}

function closeProductModal() {
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
}

async function checkout() {
  if (!state.cart.length) {
    showToast("购物车为空，先选择一款零食吧");
    return;
  }
  const result = await checkoutProvider.createCheckout([...state.cart]);
  if (result.ok) {
    state.cart = [];
    saveCart();
    renderCart();
    closeCart();
    showToast(`订单 ${result.orderId} 已模拟提交成功`);
  }
}

document.addEventListener("click", (event) => {
  const target = event.target.closest("button, a");
  if (!target) return;

  const addId = target.dataset.add;
  const detailId = target.dataset.detail;
  const increaseId = target.dataset.increase;
  const decreaseId = target.dataset.decrease;
  const removeId = target.dataset.remove;

  if (addId) addToCart(addId);
  if (detailId) openProductModal(detailId);
  if (increaseId) updateQuantity(increaseId, 1);
  if (decreaseId) updateQuantity(decreaseId, -1);
  if (removeId) removeFromCart(removeId);
  if (target.matches(".cart-trigger")) openCart();
  if (target.matches("[data-close-cart]")) closeCart();
  if (target.matches("[data-close-modal]")) closeProductModal();
  if (target.matches("[data-checkout]")) checkout();
});

document.querySelectorAll("[data-filter]").forEach((button) => {
  button.addEventListener("click", () => {
    state.filter = button.dataset.filter;
    document.querySelectorAll("[data-filter]").forEach((node) => {
      const isActive = node === button;
      node.classList.toggle("is-active", isActive);
      node.setAttribute("aria-selected", String(isActive));
    });
    renderProducts();
  });
});

cartDrawer.addEventListener("click", (event) => {
  if (event.target === cartDrawer) closeCart();
});

modal.addEventListener("click", (event) => {
  if (event.target === modal) closeProductModal();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeCart();
    closeProductModal();
  }
});

renderProducts();
renderCart();
