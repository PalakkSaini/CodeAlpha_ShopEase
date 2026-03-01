/* ================= INITIAL SETUP ================= */

let cart = JSON.parse(localStorage.getItem("cart")) || [];

// 🔥 Fix old cart data (IMPORTANT)
cart = cart.map(item => {
  return {
    ...item,
    quantity: item.quantity ? Number(item.quantity) : 1,
    price: Number(item.price) || 0
  };
});

localStorage.setItem("cart", JSON.stringify(cart));

const SHIPPING_FEE = 100;
const PLATFORM_FEE = 49;
const TAX_PERCENT = 5;

let discountValue = 0;
let discountType = null;

/* ================= DOM ELEMENTS ================= */

const cartItemsContainer = document.getElementById("cart-items");
const subtotalEl = document.getElementById("subtotal");
const shippingEl = document.getElementById("shipping");
const platformEl = document.getElementById("platform");
const taxEl = document.getElementById("tax");
const totalEl = document.getElementById("total");
const discountEl = document.getElementById("discount");
const emptyCartMsg = document.getElementById("empty-cart");
const cartCountEl = document.getElementById("cart-count");

/* ================= ADD TO CART ================= */

function addToCart(product) {
  const existingItem = cart.find(item => item.id === product.id);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      ...product,
      price: Number(product.price) || 0,
      quantity: 1
    });
  }

  saveCart();
  renderCart();
}

/* ================= RENDER CART ================= */

function renderCart() {
  cartItemsContainer.innerHTML = "";

  if (cart.length === 0) {
    emptyCartMsg.style.display = "block";
  } else {
    emptyCartMsg.style.display = "none";
  }

  cart.forEach(item => {

    const price = Number(item.price) || 0;
    const quantity = Number(item.quantity) || 1;

    const div = document.createElement("div");
    div.classList.add("cart-item");

    div.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <div class="item-details">
        <h4>${item.name}</h4>
        <p class="price">₹${price}</p>

        <div class="quantity">
          <button class="qty-btn" onclick="changeQty(${item.id}, -1)">-</button>
          <span>${quantity}</span>
          <button class="qty-btn" onclick="changeQty(${item.id}, 1)">+</button>
        </div>

        <button class="remove-btn" onclick="removeItem(${item.id})">
          Remove
        </button>
      </div>
    `;

    cartItemsContainer.appendChild(div);
  });

  updateTotals();
  updateCartCount();
}

/* ================= CHANGE QUANTITY ================= */

function changeQty(id, change) {
  cart = cart.map(item => {
    if (item.id === id) {
      item.quantity = Number(item.quantity) + change;
      if (item.quantity < 1) item.quantity = 1;
    }
    return item;
  });

  saveCart();
  renderCart();
}

/* ================= REMOVE ITEM ================= */

function removeItem(id) {
  cart = cart.filter(item => item.id !== id);

  saveCart();
  renderCart();
}

/* ================= APPLY COUPON ================= */

function applyCoupon() {
  const input = document.getElementById("coupon-input").value.trim();
  const msg = document.getElementById("coupon-msg");

  discountValue = 0;
  discountType = null;

  if (input === "SAVE10") {
    discountType = "percent";
    discountValue = 10;
    msg.textContent = "10% Discount Applied!";
    msg.style.color = "green";
  }
  else if (input === "FLAT500") {
    discountType = "flat";
    discountValue = 500;
    msg.textContent = "₹500 Discount Applied!";
    msg.style.color = "green";
  }
  else {
    msg.textContent = "Invalid Coupon Code!";
    msg.style.color = "red";
  }

  updateTotals();
}

/* ================= CALCULATE TOTAL ================= */

function updateTotals() {
  let subtotal = 0;

  cart.forEach(item => {
    const price = Number(item.price) || 0;
    const quantity = Number(item.quantity) || 1;
    subtotal += price * quantity;
  });

  let shipping = subtotal > 5000 ? 0 : SHIPPING_FEE;
  let tax = (subtotal * TAX_PERCENT) / 100;

  let discountAmount = 0;

  if (discountType === "percent") {
    discountAmount = (subtotal * discountValue) / 100;
  } else if (discountType === "flat") {
    discountAmount = discountValue;
  }

  let total = subtotal + shipping + PLATFORM_FEE + tax - discountAmount;

  if (total < 0) total = 0;

  subtotalEl.textContent = "₹" + subtotal.toFixed(2);
  shippingEl.textContent = shipping === 0 ? "FREE" : "₹" + shipping;
  platformEl.textContent = "₹" + PLATFORM_FEE;
  taxEl.textContent = "₹" + tax.toFixed(2);
  discountEl.textContent = "- ₹" + discountAmount.toFixed(2);
  totalEl.textContent = "₹" + total.toFixed(2);
}

/* ================= NAVBAR CART COUNT ================= */

function updateCartCount() {
  const totalItems = cart.reduce((sum, item) => {
    return sum + (Number(item.quantity) || 0);
  }, 0);

  cartCountEl.textContent = totalItems;
}

/* ================= LOCAL STORAGE ================= */

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

/* ================= INIT LOAD ================= */

renderCart();
