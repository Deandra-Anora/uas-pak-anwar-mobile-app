// === RENDER CART ITEMS ===
function renderCartItems() {
  const cart = getCart();
  const cartItemsContainer = document.getElementById("cart-items");
  const emptyCart = document.getElementById("empty-cart");
  const cartSummary = document.getElementById("cart-summary");

  if (!cartItemsContainer) return;

  const cartProducts = Object.keys(cart).map((id) => {
    const product = products.find((p) => p.id == id);
    return { ...product, quantity: cart[id] };
  });

  if (cartProducts.length === 0) {
    cartItemsContainer.innerHTML = "";
    emptyCart.style.display = "block";
    cartSummary.style.display = "none";
    return;
  }

  emptyCart.style.display = "none";
  cartSummary.style.display = "block";

  cartItemsContainer.innerHTML = cartProducts
    .map(
      (item) => `
    <div class="card mb-3">
      <div class="cart-item">
        <img src="${item.image}" alt="${item.name}">
        <div class="cart-item-details">
          <h6 class="mb-1">${item.name}</h6>
          <p class="text-muted mb-2">Rp ${item.price.toLocaleString(
            "id-ID"
          )}</p>
          <div class="d-flex justify-content-between align-items-center">
            <div class="quantity-controls">
              <button class="btn btn-outline-primary btn-sm" onclick="updateCartQuantity(${
                item.id
              }, -1)">
                <i data-lucide="minus"></i>
              </button>
              <span>${item.quantity}</span>
              <button class="btn btn-outline-primary btn-sm" onclick="updateCartQuantity(${
                item.id
              }, 1)">
                <i data-lucide="plus"></i>
              </button>
            </div>
            <button class="btn btn-outline-danger btn-sm" onclick="removeFromCart(${
              item.id
            })">
              <i data-lucide="trash-2"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  `
    )
    .join("");

  // Calculate total
  const total = cartProducts.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  document.getElementById("subtotal").textContent =
    "Rp " + total.toLocaleString("id-ID");
  document.getElementById("total").textContent =
    "Rp " + total.toLocaleString("id-ID");

  lucide.createIcons();
}

// === UPDATE CART QUANTITY ===
function updateCartQuantity(productId, change) {
  const cart = getCart();
  const newQty = (cart[productId] || 0) + change;

  if (newQty <= 0) {
    delete cart[productId];
  } else {
    cart[productId] = newQty;
  }

  saveCart(cart);
  renderCartItems();
}

// === REMOVE FROM CART ===
function removeFromCart(productId) {
  const cart = getCart();
  delete cart[productId];
  saveCart(cart);
  renderCartItems();
}

// === CHECKOUT ===
function checkout() {
  const cart = getCart();
  const cartProducts = Object.keys(cart).map((id) => {
    const product = products.find((p) => p.id == id);
    return { ...product, quantity: cart[id] };
  });

  const total = cartProducts.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  sessionStorage.setItem("ss_payment_amount", total);
  window.location.href = "success.html";
}

// === INITIALIZE CART PAGE ===
if (document.getElementById("cart-items")) {
  document.addEventListener("DOMContentLoaded", () => {
    loadTheme();
    renderCartItems();
  });
}
