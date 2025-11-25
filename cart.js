// === RENDER CART ITEMS ===
function renderCartItems() {
  const cart = getCart();
  const cartContainer = document.getElementById("cart-items-container");
  const emptyCart = document.getElementById("empty-cart");
  const cartSummary = document.getElementById("cart-summary");

  if (!cartContainer) return;

  const cartProducts = Object.keys(cart).map((id) => {
    const product = products.find((p) => p.id == id);
    return { ...product, quantity: cart[id] };
  });

  if (cartProducts.length === 0) {
    cartContainer.innerHTML = "";
    if (emptyCart) emptyCart.style.display = "block";
    if (cartSummary) cartSummary.style.display = "none";
    return;
  }

  if (emptyCart) emptyCart.style.display = "none";
  if (cartSummary) cartSummary.style.display = "block";

  cartContainer.innerHTML = cartProducts
    .map(
      (item) => `
    <div class="cart-item-card">
      <img src="${item.image}" alt="${item.name}" class="cart-item-image">
      <div class="cart-item-details">
        <h3 class="cart-item-name">${item.name}</h3>
        <p class="cart-item-price">Rp ${item.price.toLocaleString("id-ID")}</p>
        <div class="cart-item-actions">
          <div class="quantity-controls">
            <button class="qty-btn" onclick="updateCartQuantity(${
              item.id
            }, -1)">
              <i data-lucide="minus"></i>
            </button>
            <span class="qty-display">${item.quantity}</span>
            <button class="qty-btn" onclick="updateCartQuantity(${item.id}, 1)">
              <i data-lucide="plus"></i>
            </button>
          </div>
          <button class="btn-remove" onclick="removeFromCart(${item.id})">
            <i data-lucide="trash-2"></i>
            Remove
          </button>
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

  const subtotalElement = document.getElementById("subtotal");
  const totalElement = document.getElementById("total");

  if (subtotalElement) {
    subtotalElement.textContent = "Rp " + total.toLocaleString("id-ID");
  }

  if (totalElement) {
    totalElement.textContent = "Rp " + total.toLocaleString("id-ID");
  }

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
  if (confirm("Remove this item from cart?")) {
    const cart = getCart();
    delete cart[productId];
    saveCart(cart);
    renderCartItems();
  }
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
if (document.getElementById("cart-items-container")) {
  document.addEventListener("DOMContentLoaded", () => {
    renderCartItems();
    updateCartBadge();
  });
}
