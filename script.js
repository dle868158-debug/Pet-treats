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

const BASE_FOOD_FILTERS = ["鸡肉", "冻干", "洁齿", "训练奖励"];
const PRODUCTS_KEY = "pawNaturalProducts";
const ORDERS_KEY = "pawNaturalOrders";
const USERS_KEY = "pawNaturalUsers";
const SESSION_KEY = "pawNaturalSession";
const GUEST_KEY = "pawNaturalGuest";
const OPEN_CART_KEY = "pawNaturalOpenCart";

function loadStoredProducts() {
  try {
    const storedProducts = JSON.parse(localStorage.getItem(PRODUCTS_KEY)) || [];
    return Array.isArray(storedProducts) ? storedProducts : [];
  } catch {
    return [];
  }
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

function getMergedProducts() {
  const mergedProducts = new Map(defaultProducts.map((product) => [product.id, normalizeProduct(product)]));
  loadStoredProducts().forEach((product) => {
    if (product.id) mergedProducts.set(product.id, normalizeProduct(product));
  });
  return [...mergedProducts.values()];
}

const products = getMergedProducts();
const FOOD_FILTERS = [...new Set([...BASE_FOOD_FILTERS, ...products.map((product) => product.category).filter(Boolean)])];

const checkoutProvider = {
  async createCheckout(cartItems, customer, address) {
    await new Promise((resolve) => window.setTimeout(resolve, 450));
    const orderId = `ZN-${Date.now().toString().slice(-6)}`;
    const order = createOrderRecord(cartItems, customer, address, orderId);
    saveOrder(order);
    return {
      ok: true,
      orderId,
      ...order
    };
  }
};

const state = {
  petFilter: "all",
  foodFilter: "all",
  cart: loadCart(),
  currentUser: loadCurrentUser(),
  isGuest: localStorage.getItem(GUEST_KEY) === "true"
};

const grid = document.querySelector("[data-product-grid]");
const hotList = document.querySelector("[data-hot-list]");
const foodFilterBar = document.querySelector("[data-food-filter-bar]");
const accountLink = document.querySelector("[data-account-link]");
const cartDrawer = document.querySelector("[data-cart-drawer]");
const cartItemsNode = document.querySelector("[data-cart-items]");
const cartCountNodes = document.querySelectorAll("[data-cart-count]");
const cartTotalNode = document.querySelector("[data-cart-total]");
const checkoutAccountNode = document.querySelector("[data-checkout-account]");
const modal = document.querySelector("[data-product-modal]");
const modalBody = document.querySelector("[data-modal-body]");
const accountModal = document.querySelector("[data-account-modal]");
const accountSummary = document.querySelector("[data-account-summary]");
const addressList = document.querySelector("[data-address-list]");
const addressForm = document.querySelector("[data-address-form]");
const checkoutModal = document.querySelector("[data-checkout-modal]");
const checkoutAddressPanel = document.querySelector("[data-checkout-address-panel]");
const checkoutAddressForm = document.querySelector("[data-checkout-address-form]");
const toggleCheckoutAddressButton = document.querySelector("[data-toggle-checkout-address]");
const toast = document.querySelector("[data-toast]");
let selectedCheckoutAddressId = null;

function formatCurrency(value) {
  return new Intl.NumberFormat("zh-CN", {
    style: "currency",
    currency: "CNY",
    maximumFractionDigits: 0
  }).format(value);
}

function formatSales(value) {
  return new Intl.NumberFormat("zh-CN").format(value);
}

function getPetLabel(product) {
  if (product.petTypes.includes("cat") && product.petTypes.includes("dog")) return "猫狗通用";
  if (product.petTypes.includes("cat")) return "猫猫适用";
  return "狗狗适用";
}

function productMatchesPet(product, petType) {
  return petType === "all" || product.petTypes.includes(petType);
}

function productMatchesFood(product, category) {
  return category === "all" || product.category === category;
}

function getAvailableFoodFilters() {
  const availableCategories = new Set(
    products.filter((product) => productMatchesPet(product, state.petFilter)).map((product) => product.category)
  );
  return FOOD_FILTERS.filter((category) => availableCategories.has(category));
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

function loadOrders() {
  try {
    const orders = JSON.parse(localStorage.getItem(ORDERS_KEY)) || [];
    return Array.isArray(orders) ? orders : [];
  } catch {
    return [];
  }
}

function saveOrder(order) {
  localStorage.setItem(ORDERS_KEY, JSON.stringify([order, ...loadOrders()]));
}

function createOrderRecord(cartItems, customer, address, orderId) {
  const items = cartItems
    .map((item) => {
      const product = getProduct(item.productId);
      return {
        productId: item.productId,
        name: product?.name || item.productId,
        price: Number(product?.price) || 0,
        quantity: Number(item.quantity) || 0
      };
    })
    .filter((item) => item.quantity > 0);
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return {
    id: orderId,
    createdAt: new Date().toISOString(),
    customer: {
      name: customer?.name || customer?.email || "演示用户",
      email: customer?.email || ""
    },
    address: {
      receiver: address.receiver,
      phone: address.phone,
      region: address.region,
      detail: address.detail,
      note: address.note || ""
    },
    items,
    total,
    status: "待配送"
  };
}

function loadUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
  } catch {
    return [];
  }
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function normalizeUser(user) {
  return {
    ...user,
    addresses: user.addresses || (user.address ? [{ ...user.address, id: `addr-${Date.now()}`, isDefault: true }] : [])
  };
}

function loadCurrentUser() {
  const sessionEmail = localStorage.getItem(SESSION_KEY);
  if (!sessionEmail) return null;
  const users = loadUsers().map(normalizeUser);
  const user = users.find((item) => item.email === sessionEmail) || null;
  if (user) saveUsers(users);
  return user;
}

function saveCurrentUser(updates) {
  if (!state.currentUser) return;
  const users = loadUsers().map(normalizeUser);
  const nextUser = { ...state.currentUser, ...updates };
  const nextUsers = users.map((user) => (user.email === nextUser.email ? nextUser : user));
  state.currentUser = nextUser;
  saveUsers(nextUsers);
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

function getAddresses() {
  return state.currentUser?.addresses || [];
}

function getDefaultAddress() {
  return getAddresses().find((address) => address.isDefault) || getAddresses()[0] || null;
}

function formatAddressLine(address) {
  return `${address.receiver} · ${address.phone} · ${address.region} ${address.detail}`;
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove("is-visible"), 2400);
}

function renderHotSales() {
  if (!hotList) return;

  hotList.innerHTML = [...products]
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 3)
    .map(
      (product, index) => `
        <li class="hot-item">
          <span class="rank-badge">TOP ${index + 1}</span>
          <div class="hot-copy">
            <button class="hot-title" type="button" data-detail="${product.id}">${product.name}</button>
            <span>${product.category} · ${formatSales(product.sales)} 件已售</span>
          </div>
          <div class="hot-action">
            <strong>${formatCurrency(product.price)}</strong>
            <button class="mini-button" type="button" data-add="${product.id}">加入</button>
          </div>
        </li>
      `
    )
    .join("");
}

function renderFoodFilters() {
  if (!foodFilterBar) return;
  const availableFilters = getAvailableFoodFilters();
  if (state.foodFilter !== "all" && !availableFilters.includes(state.foodFilter)) {
    state.foodFilter = "all";
  }

  foodFilterBar.innerHTML = [
    { value: "all", label: "全部食品" },
    ...availableFilters.map((category) => ({ value: category, label: category }))
  ]
    .map(
      (filter) => `
        <button class="filter-chip ${state.foodFilter === filter.value ? "is-active" : ""}" type="button" data-food-filter="${filter.value}" role="tab" aria-selected="${state.foodFilter === filter.value}">
          ${filter.label}
        </button>
      `
    )
    .join("");
}

function renderPetFilters() {
  document.querySelectorAll("[data-pet-filter]").forEach((button) => {
    const isActive = button.dataset.petFilter === state.petFilter;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-selected", String(isActive));
  });
}

function setPetFilter(petType) {
  state.petFilter = petType;
  state.foodFilter = "all";
  renderPetFilters();
  renderFoodFilters();
  renderProducts();
}

function setFoodFilter(category) {
  state.foodFilter = category;
  renderFoodFilters();
  renderProducts();
}

function renderProducts() {
  const visibleProducts = products.filter(
    (product) => productMatchesPet(product, state.petFilter) && productMatchesFood(product, state.foodFilter)
  );

  grid.innerHTML = visibleProducts
    .map(
      (product) => `
        <article class="product-card">
          <img src="${product.image}" alt="${product.name}" loading="lazy">
          <div class="product-content">
            <div class="product-meta">
              <span class="tag pet-tag">${getPetLabel(product)}</span>
              ${product.tags.filter((tag) => tag !== getPetLabel(product)).map((tag) => `<span class="tag">${tag}</span>`).join("")}
            </div>
            <div class="product-title">
              <div class="product-name">
                <h3>${product.name}</h3>
                <span class="sales-count">已售 ${formatSales(product.sales)} 件</span>
              </div>
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

function renderAccountState() {
  if (state.currentUser) {
    accountLink.textContent = "账户中心";
    accountLink.href = "#";
    accountLink.dataset.accountCenter = "true";
    renderCheckoutAccount();
    return;
  }

  accountLink.textContent = "游客模式 · 登录";
  accountLink.href = "auth.html?return=home";
  delete accountLink.dataset.accountCenter;
  renderCheckoutAccount();
}

function renderCheckoutAccount() {
  if (!state.currentUser) {
    checkoutAccountNode.innerHTML = `
      <strong>游客购买前需要登录</strong>
      <span>游客可以浏览和加购商品，购买前需要登录账号。</span>
      <a href="auth.html?return=checkout">登录后购买</a>
    `;
    return;
  }

  checkoutAccountNode.innerHTML = `
    <strong>${state.currentUser.name}</strong>
    <span>购买前会确认收货地址。</span>
    <button class="inline-action" type="button" data-open-account>管理地址</button>
  `;
}

function renderAccountModal() {
  if (!state.currentUser) return;
  const addresses = getAddresses();

  accountSummary.innerHTML = `
    <strong>${state.currentUser.name}</strong>
    <span>${state.currentUser.email}</span>
    <button class="plain-button" type="button" data-logout>退出登录</button>
  `;

  addressList.innerHTML = addresses.length
    ? addresses
        .map(
          (address) => `
            <article class="address-card">
              <div>
                <div class="address-title">
                  <strong>${address.receiver}</strong>
                  ${address.isDefault ? '<span class="default-badge">默认</span>' : ""}
                </div>
                <p>${address.phone}</p>
                <p>${address.region} ${address.detail}</p>
                ${address.note ? `<p>${address.note}</p>` : ""}
              </div>
              <div class="address-actions">
                <button class="plain-button" type="button" data-set-default="${address.id}">设为默认</button>
                <button class="remove-button" type="button" data-delete-address="${address.id}">删除</button>
              </div>
            </article>
          `
        )
        .join("")
    : `
      <div class="empty-state compact">
        <p>还没有收货地址。添加后结算时可直接选择。</p>
      </div>
    `;

  addressForm.elements.isDefault.checked = !addresses.length;
}

function openAccountModal() {
  if (!state.currentUser) {
    window.location.href = "auth.html?return=checkout";
    return;
  }
  renderAccountModal();
  accountModal.classList.add("is-open");
  accountModal.setAttribute("aria-hidden", "false");
}

function closeAccountModal() {
  accountModal.classList.remove("is-open");
  accountModal.setAttribute("aria-hidden", "true");
}

function readAddressForm(form = addressForm) {
  const data = new FormData(form);
  return {
    id: `addr-${Date.now()}`,
    receiver: String(data.get("receiver") || "").trim(),
    phone: String(data.get("phone") || "").trim(),
    region: String(data.get("region") || "").trim(),
    detail: String(data.get("detail") || "").trim(),
    note: String(data.get("note") || "").trim(),
    isDefault: data.get("isDefault") === "on"
  };
}

function getMissingAddressFields(address) {
  const requiredFields = [
    ["receiver", "收货人"],
    ["phone", "联系电话"],
    ["region", "所在地区"],
    ["detail", "详细地址"]
  ];
  return requiredFields.filter(([key]) => !address[key]).map(([, label]) => label);
}

function addAddress(address) {
  const missingFields = getMissingAddressFields(address);
  if (missingFields.length) {
    showToast(`请填写${missingFields.join("、")}`);
    return null;
  }

  const addresses = getAddresses();
  const nextAddress = {
    ...address,
    isDefault: address.isDefault || addresses.length === 0
  };
  const nextAddresses = nextAddress.isDefault
    ? addresses.map((item) => ({ ...item, isDefault: false }))
    : addresses;

  saveCurrentUser({ addresses: [...nextAddresses, nextAddress] });
  renderAccountModal();
  renderCheckoutAccount();
  renderCheckoutModal();
  showToast("地址已保存");
  return nextAddress;
}

function setDefaultAddress(addressId) {
  const addresses = getAddresses().map((address) => ({
    ...address,
    isDefault: address.id === addressId
  }));
  saveCurrentUser({ addresses });
  renderAccountModal();
  renderCheckoutAccount();
  renderCheckoutModal();
}

function deleteAddress(addressId) {
  const nextAddresses = getAddresses().filter((address) => address.id !== addressId);
  if (nextAddresses.length && !nextAddresses.some((address) => address.isDefault)) {
    nextAddresses[0].isDefault = true;
  }
  saveCurrentUser({ addresses: nextAddresses });
  renderAccountModal();
  renderCheckoutAccount();
  renderCheckoutModal();
}

function logout() {
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(GUEST_KEY);
  state.currentUser = null;
  state.isGuest = false;
  window.location.href = "auth.html?return=home";
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
          <p class="eyebrow">${getPetLabel(product)} · ${product.category} · ${product.weight}</p>
          <h2 id="modal-title">${product.name}</h2>
          <p class="modal-sales">已售 ${formatSales(product.sales)} 件</p>
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

function getSelectedCheckoutAddress() {
  const addresses = getAddresses();
  return addresses.find((address) => address.id === selectedCheckoutAddressId) || getDefaultAddress();
}

function setCheckoutAddressFormVisible(isVisible) {
  checkoutAddressForm.hidden = !isVisible;
  toggleCheckoutAddressButton.textContent = isVisible ? "收起新增地址" : "新增收货地址";
  if (isVisible && !getAddresses().length) {
    checkoutAddressForm.elements.isDefault.checked = true;
  }
}

function renderCheckoutModal() {
  if (!checkoutAddressPanel || !state.currentUser) return;
  const addresses = getAddresses();
  if (!addresses.length) {
    selectedCheckoutAddressId = null;
    checkoutAddressPanel.innerHTML = `
      <div class="empty-state compact">
        <p>还没有收货地址。请先新增一个地址，再确认购买。</p>
      </div>
    `;
    setCheckoutAddressFormVisible(true);
    return;
  }

  const selectedAddress = getSelectedCheckoutAddress() || addresses[0];
  selectedCheckoutAddressId = selectedAddress.id;
  checkoutAddressPanel.innerHTML = `
    <div class="checkout-address-list">
      ${addresses
        .map(
          (address) => `
            <label class="checkout-address-option ${address.id === selectedCheckoutAddressId ? "is-selected" : ""}">
              <input type="radio" name="checkoutAddress" value="${address.id}" ${address.id === selectedCheckoutAddressId ? "checked" : ""} data-select-checkout-address>
              <span>
                <strong>${address.receiver}</strong>
                ${address.isDefault ? '<em class="default-badge">默认地址</em>' : ""}
                <small>${address.phone}</small>
                <small>${address.region} ${address.detail}</small>
                ${address.note ? `<small>${address.note}</small>` : ""}
              </span>
            </label>
          `
        )
        .join("")}
    </div>
    <button class="plain-button full-width" type="button" data-default-checkout-address="${selectedCheckoutAddressId}">
      设为默认地址
    </button>
  `;
  setCheckoutAddressFormVisible(false);
}

function openCheckoutModal() {
  selectedCheckoutAddressId = getDefaultAddress()?.id || null;
  renderCheckoutModal();
  checkoutModal.classList.add("is-open");
  checkoutModal.setAttribute("aria-hidden", "false");
}

function closeCheckoutModal() {
  checkoutModal.classList.remove("is-open");
  checkoutModal.setAttribute("aria-hidden", "true");
}

async function confirmCheckout() {
  const selectedAddress = getSelectedCheckoutAddress();
  if (!selectedAddress) {
    showToast("请先新增或选择收货地址");
    setCheckoutAddressFormVisible(true);
    return;
  }

  const result = await checkoutProvider.createCheckout([...state.cart], state.currentUser, selectedAddress);
  if (result.ok) {
    state.cart = [];
    saveCart();
    renderCart();
    closeCheckoutModal();
    closeCart();
    showToast(`订单 ${result.orderId} 已提交，购买成功`);
  }
}

function checkout() {
  if (!state.cart.length) {
    showToast("购物车为空，先选择一款零食吧");
    return;
  }

  if (!state.currentUser) {
    localStorage.setItem(OPEN_CART_KEY, "true");
    localStorage.removeItem(GUEST_KEY);
    window.location.replace("auth.html?return=checkout");
    return;
  }

  openCheckoutModal();
}

document.addEventListener("click", (event) => {
  const target = event.target.closest("button, a");
  if (!target) return;

  const addId = target.dataset.add;
  const detailId = target.dataset.detail;
  const increaseId = target.dataset.increase;
  const decreaseId = target.dataset.decrease;
  const removeId = target.dataset.remove;
  const petFilter = target.dataset.petFilter;
  const foodFilter = target.dataset.foodFilter;
  const checkoutAddressId = target.dataset.defaultCheckoutAddress;
  const defaultAddressId = target.dataset.setDefault;
  const deleteAddressId = target.dataset.deleteAddress;

  if (petFilter) {
    setPetFilter(petFilter);
    return;
  }
  if (foodFilter) {
    setFoodFilter(foodFilter);
    return;
  }
  if (target.dataset.accountCenter || target.matches("[data-open-account]")) {
    event.preventDefault();
    openAccountModal();
    return;
  }
  if (target.matches("[data-close-account]")) closeAccountModal();
  if (target.matches("[data-close-checkout]")) closeCheckoutModal();
  if (target.matches("[data-toggle-checkout-address]")) {
    setCheckoutAddressFormVisible(checkoutAddressForm.hidden);
    return;
  }
  if (target.matches("[data-confirm-checkout]")) confirmCheckout();
  if (target.matches("[data-logout]")) logout();
  if (checkoutAddressId) setDefaultAddress(checkoutAddressId);
  if (defaultAddressId) setDefaultAddress(defaultAddressId);
  if (deleteAddressId) deleteAddress(deleteAddressId);
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

addressForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const nextAddress = addAddress(readAddressForm());
  if (nextAddress) addressForm.reset();
});

checkoutAddressForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const nextAddress = addAddress(readAddressForm(checkoutAddressForm));
  if (!nextAddress) return;
  selectedCheckoutAddressId = nextAddress.id;
  checkoutAddressForm.reset();
  renderCheckoutModal();
});

checkoutAddressPanel.addEventListener("change", (event) => {
  if (!event.target.matches("[data-select-checkout-address]")) return;
  selectedCheckoutAddressId = event.target.value;
  renderCheckoutModal();
});

cartDrawer.addEventListener("click", (event) => {
  if (event.target === cartDrawer) closeCart();
});

modal.addEventListener("click", (event) => {
  if (event.target === modal) closeProductModal();
});

accountModal.addEventListener("click", (event) => {
  if (event.target === accountModal) closeAccountModal();
});

checkoutModal.addEventListener("click", (event) => {
  if (event.target === checkoutModal) closeCheckoutModal();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeCart();
    closeProductModal();
    closeAccountModal();
    closeCheckoutModal();
  }
});

renderFoodFilters();
renderProducts();
renderHotSales();
renderAccountState();
renderCart();

if (localStorage.getItem(OPEN_CART_KEY) === "true") {
  localStorage.removeItem(OPEN_CART_KEY);
  openCart();
}
