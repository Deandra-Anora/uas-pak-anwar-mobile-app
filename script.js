// === PRODUCTS DATA ===
const products = [
  {
    id: 1,
    name: "Nike Air Force 1",
    price: 1499000,
    image: "assets/product1.avif",
  },
  {
    id: 2,
    name: "Nike Zoom Vomero 5 SE",
    price: 1999000,
    image: "assets/product2.avif",
  },
  {
    id: 3,
    name: "Nike Air Jordan MVP 92",
    price: 2799000,
    image: "assets/product3.avif",
  },
  {
    id: 4,
    name: "Nike Jordan NOLA",
    price: 2299000,
    image: "assets/product4.avif",
  },
  {
    id: 5,
    name: "Nike SB Zoom Blazer Mid",
    price: 1599000,
    image: "assets/product5.avif",
  },
  {
    id: 6,
    name: "Nike SB x Air Jordan 4",
    price: 3299000,
    image: "assets/product6.avif",
  },
  {
    id: 7,
    name: "Nike Go FlyEase",
    price: 1799000,
    image: "assets/product7.avif",
  },
  { id: 8, name: "Nike P 6000", price: 1499000, image: "assets/product8.avif" },
];

// === LOAD THEME ===
function loadTheme() {
  const theme = localStorage.getItem("ss_theme");
  if (theme === "dark") {
    document.body.setAttribute("data-bs-theme", "dark");
    const themeIcon = document.getElementById("theme-icon");
    if (themeIcon) {
      themeIcon.setAttribute("data-lucide", "sun");
      lucide.createIcons();
    }
  }
}

// === THEME TOGGLE ===
const themeToggle = document.getElementById("themeToggle");
if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const isDark = document.body.getAttribute("data-bs-theme") === "dark";
    const themeIcon = document.getElementById("theme-icon");

    if (isDark) {
      document.body.removeAttribute("data-bs-theme");
      localStorage.setItem("ss_theme", "light");
      themeIcon.setAttribute("data-lucide", "moon");
    } else {
      document.body.setAttribute("data-bs-theme", "dark");
      localStorage.setItem("ss_theme", "dark");
      themeIcon.setAttribute("data-lucide", "sun");
    }

    lucide.createIcons();
  });
}

// === GET CART ===
function getCart() {
  const cart = localStorage.getItem("ss_cart");
  return cart ? JSON.parse(cart) : {};
}

// === SAVE CART ===
function saveCart(cart) {
  localStorage.setItem("ss_cart", JSON.stringify(cart));
  updateCartBadge();
}

// === UPDATE CART BADGE ===
function updateCartBadge() {
  const badge = document.getElementById("cart-badge");
  if (badge) {
    const cart = getCart();
    const total = Object.values(cart).reduce((sum, qty) => sum + qty, 0);
    badge.textContent = total;
    badge.style.display = total > 0 ? "inline-block" : "none";
  }
}

// === ADD TO CART ===
function addToCart(productId) {
  const cart = getCart();
  cart[productId] = (cart[productId] || 0) + 1;
  saveCart(cart);
  renderProducts();
}

// === UPDATE QUANTITY ===
function updateQuantity(productId, change) {
  const cart = getCart();
  const newQty = (cart[productId] || 0) + change;

  if (newQty <= 0) {
    delete cart[productId];
  } else {
    cart[productId] = newQty;
  }

  saveCart(cart);
  renderProducts();
}

// === RENDER PRODUCTS ===
function renderProducts() {
  const container = document.getElementById("product-list");
  if (!container) return;

  const cart = getCart();

  container.innerHTML = products
    .map((product) => {
      const quantity = cart[product.id] || 0;

      return `
      <div class="col">
        <div class="card product-card h-100">
          <img src="${product.image}" class="card-img-top" alt="${
        product.name
      }">
          <div class="card-body d-flex flex-column">
            <h6 class="card-title">${product.name}</h6>
            <p class="card-text text-muted mb-auto">Rp ${product.price.toLocaleString(
              "id-ID"
            )}</p>
            ${
              quantity === 0
                ? `
              <button class="btn btn-primary btn-sm mt-2" onclick="addToCart(${product.id})">
                Tambah
              </button>
            `
                : `
              <div class="quantity-controls mt-2">
                <button class="btn btn-outline-primary btn-sm" onclick="updateQuantity(${product.id}, -1)">
                  <i data-lucide="minus"></i>
                </button>
                <span>${quantity}</span>
                <button class="btn btn-outline-primary btn-sm" onclick="updateQuantity(${product.id}, 1)">
                  <i data-lucide="plus"></i>
                </button>
              </div>
            `
            }
          </div>
        </div>
      </div>
    `;
    })
    .join("");

  lucide.createIcons();
}

// === REGISTER SERVICE WORKER ===
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("sw.js")
      .then((reg) => console.log("Service Worker registered"))
      .catch((err) => console.log("Service Worker registration failed:", err));
  });
}

// === INITIALIZE ===
document.addEventListener("DOMContentLoaded", () => {
  loadTheme();
  updateCartBadge();
  renderProducts();
});

// ==========================
// FLOATING PWA INSTALL BUTTON
// ==========================
let deferredPrompt;
const installBtn = document.getElementById("installBtn");

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;

  if (installBtn) installBtn.style.display = "flex"; // tampilkan
});

if (installBtn) {
  installBtn.addEventListener("click", async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();

    const choice = await deferredPrompt.userChoice;
    console.log("User choice:", choice.outcome);

    deferredPrompt = null;
    installBtn.style.display = "none";
  });
}
