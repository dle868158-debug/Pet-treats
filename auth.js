const USERS_KEY = "pawNaturalUsers";
const SESSION_KEY = "pawNaturalSession";
const GUEST_KEY = "pawNaturalGuest";
const OPEN_CART_KEY = "pawNaturalOpenCart";

const loginForm = document.querySelector("[data-login-form]");
const registerForm = document.querySelector("[data-register-form]");
const guestButton = document.querySelector("[data-guest-entry]");
const messageNode = document.querySelector("[data-auth-message]");
const tabButtons = document.querySelectorAll("[data-auth-tab]");

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

function normalizeEmail(value) {
  return value.trim().toLowerCase();
}

function normalizeUser(user) {
  return {
    ...user,
    addresses: user.addresses || (user.address ? [{ ...user.address, id: `addr-${Date.now()}`, isDefault: true }] : [])
  };
}

function showMessage(message, type = "info") {
  messageNode.textContent = message;
  messageNode.dataset.type = type;
}

function getReturnMode() {
  return new URLSearchParams(window.location.search).get("return") || "home";
}

function redirectAfterAuth() {
  if (getReturnMode() === "checkout") {
    localStorage.setItem(OPEN_CART_KEY, "true");
    window.location.href = "index.html#products";
    return;
  }
  window.location.href = "index.html";
}

function setActiveTab(mode) {
  tabButtons.forEach((button) => {
    const isActive = button.dataset.authTab === mode;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-selected", String(isActive));
  });
  loginForm.classList.toggle("is-active", mode === "login");
  registerForm.classList.toggle("is-active", mode === "register");
  showMessage("");
}

tabButtons.forEach((button) => {
  button.addEventListener("click", () => setActiveTab(button.dataset.authTab));
});

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(loginForm);
  const email = normalizeEmail(String(data.get("email") || ""));
  const password = String(data.get("password") || "");
  const users = loadUsers().map(normalizeUser);
  const user = users.find((item) => item.email === email);

  if (!user || user.password !== password) {
    showMessage("邮箱或密码不正确。", "error");
    return;
  }

  saveUsers(users);
  localStorage.setItem(SESSION_KEY, user.email);
  localStorage.removeItem(GUEST_KEY);
  showMessage("登录成功，正在进入。", "success");
  redirectAfterAuth();
});

registerForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(registerForm);
  const name = String(data.get("name") || "").trim();
  const email = normalizeEmail(String(data.get("email") || ""));
  const password = String(data.get("password") || "");
  const users = loadUsers().map(normalizeUser);

  if (password.length < 6) {
    showMessage("密码至少需要 6 位。", "error");
    return;
  }

  if (users.some((user) => user.email === email)) {
    showMessage("该邮箱已经注册，可以直接登录。", "error");
    setActiveTab("login");
    return;
  }

  const nextUser = {
    id: `user-${Date.now()}`,
    name,
    email,
    password,
    addresses: [],
    createdAt: new Date().toISOString()
  };

  saveUsers([...users, nextUser]);
  localStorage.setItem(SESSION_KEY, nextUser.email);
  localStorage.removeItem(GUEST_KEY);
  showMessage("注册成功，正在进入。", "success");
  redirectAfterAuth();
});

guestButton.addEventListener("click", () => {
  localStorage.removeItem(SESSION_KEY);
  localStorage.setItem(GUEST_KEY, "true");
  window.location.href = "index.html";
});
