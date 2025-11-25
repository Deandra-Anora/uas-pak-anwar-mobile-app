// === PRODUCTS DATA ===
const products = [
  {
    id: 1,
    name: "Nike Air Force 1",
    price: 1499000,
    image:
      "assets/product1.jpeg",
    category: "men",
  },
  {
    id: 2,
    name: "Nike Zoom Vomero 5 SE",
    price: 1999000,
    image:
      "assets/product2.jpeg",
    category: "sports",
  },
  {
    id: 3,
    name: "Nike Air Jordan MVP 92",
    price: 2799000,
    image:
      "assets/product3.jpeg",
    category: "men",
  },
  {
    id: 4,
    name: "Nike Jordan NOLA",
    price: 2299000,
    image:
      "assets/product4.jpeg",
    category: "women",
  },
  {
    id: 5,
    name: "Nike SB Zoom Blazer Mid",
    price: 1599000,
    image:
      "assets/product5.jpeg",
    category: "sports",
  },
  {
    id: 6,
    name: "Nike SB x Air Jordan 4",
    price: 3299000,
    image:
      "assets/product6.jpeg",
    category: "men",
  },
  {
    id: 7,
    name: "Nike Go FlyEase",
    price: 1799000,
    image:
      "assets/product7.jpeg",
    category: "kids",
  },
  {
    id: 8,
    name: "Nike P 6000",
    price: 1499000,
    image:
      "assets/product8.jpeg",
    category: "women",
  },
  {
    id: 9,
    name: "Adidas Ultraboost",
    price: 2499000,
    image:
      "assets/product9.jpg",
    category: "sports",
  },
  {
    id: 10,
    name: "Puma RS-X",
    price: 1699000,
    image:
      "assets/product10.jpeg",
    category: "men",
  },
  {
    id: 11,
    name: "New Balance 574",
    price: 1399000,
    image:
      "assets/product11.jpeg",
    category: "women",
  },
  {
    id: 12,
    name: "Converse Chuck Taylor",
    price: 899000,
    image:
      "assets/product12.jpeg",
    category: "kids",
  },
];

// === CART FUNCTIONS ===
function getCart() {
  const cart = localStorage.getItem("ss_cart");
  return cart ? JSON.parse(cart) : {};
}

function saveCart(cart) {
  localStorage.setItem("ss_cart", JSON.stringify(cart));
  updateCartBadge();
}

function updateCartBadge() {
  const badge = document.getElementById("cart-badge");
  if (badge) {
    const cart = getCart();
    const total = Object.values(cart).reduce((sum, qty) => sum + qty, 0);
    badge.textContent = total;
    if (total > 0) {
      badge.classList.add("active");
    } else {
      badge.classList.remove("active");
    }
  }
}

function addToCart(productId) {
  const cart = getCart();
  cart[productId] = (cart[productId] || 0) + 1;
  saveCart(cart);
  renderProducts();
}

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
  const container = document.getElementById("products-grid");
  if (!container) return;

  const cart = getCart();

  container.innerHTML = products
    .map((product) => {
      const quantity = cart[product.id] || 0;

      return `
      <div class="product-card">
        <div class="product-image-wrapper">
          <img src="${product.image}" alt="${
        product.name
      }" class="product-image">
        </div>
        <div class="product-info">
          <div class="product-name">${product.name}</div>
          <div class="product-price">Rp ${product.price.toLocaleString(
            "id-ID"
          )}</div>
          <div class="product-actions">
            ${
              quantity === 0
                ? `
              <button class="btn-add-cart" onclick="addToCart(${product.id})">
                Add to Cart
              </button>
            `
                : `
              <div class="quantity-controls">
                <button class="qty-btn" onclick="updateQuantity(${product.id}, -1)">
                  <i data-lucide="minus"></i>
                </button>
                <span class="qty-display">${quantity}</span>
                <button class="qty-btn" onclick="updateQuantity(${product.id}, 1)">
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

// === SERVICE WORKER ===
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("sw.js")
      .then((reg) => console.log("Service Worker registered"))
      .catch((err) => console.log("Service Worker registration failed:", err));
  });
}

// === PWA INSTALL ===
let deferredPrompt;
const installBtn = document.getElementById("installBtn");

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;

  if (installBtn) installBtn.style.display = "flex";
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

// === INITIALIZE ===
document.addEventListener("DOMContentLoaded", () => {
  updateCartBadge();
  renderProducts();

  // Load theme
  if (localStorage.getItem("ss_theme") === "dark") {
    document.body.setAttribute("data-theme", "dark");
  }
});
