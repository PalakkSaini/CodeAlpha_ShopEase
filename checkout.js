// =================== CART & FEES ===================
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// 🔥 FIX CART DATA (VERY IMPORTANT)
cart = cart.map(item => {
  return {
    ...item,
    quantity: item.quantity ? Number(item.quantity) : 1,
    price: Number(item.price) || 0
  };
});

const SHIPPING_FEE = 100;
const PLATFORM_FEE = 49;
const TAX_PERCENT = 5;

let discountValue = 0;
let discountType = null;

// =================== DOM ELEMENTS ===================
const checkoutCartContainer = document.getElementById("checkout-cart-items");
const subtotalEl = document.getElementById("subtotal");
const shippingEl = document.getElementById("shipping");
const platformEl = document.getElementById("platform");
const taxEl = document.getElementById("tax");
const totalEl = document.getElementById("total");
const discountEl = document.getElementById("discount");
const cartCountEl = document.getElementById("cart-count");

// =================== RENDER CART ===================
function renderCheckoutCart() {
  checkoutCartContainer.innerHTML = "";

  if(cart.length === 0){
    checkoutCartContainer.innerHTML = "<p>Your cart is empty 🛒</p>";
  }

  cart.forEach(item => {

    const price = Number(item.price) || 0;
    const quantity = Number(item.quantity) || 1;

    const div = document.createElement("div");
    div.classList.add("cart-item-summary");
    div.innerHTML = `${item.name} x ${quantity} - ₹${(price * quantity).toFixed(2)}`;

    checkoutCartContainer.appendChild(div);
  });

  updateTotals();
  updateCartCount();
}

// =================== UPDATE TOTALS ===================
function updateTotals(){

  let subtotal = 0;

  cart.forEach(item => {
    const price = Number(item.price) || 0;
    const quantity = Number(item.quantity) || 1;
    subtotal += price * quantity;
  });

  let shipping = subtotal > 5000 ? 0 : SHIPPING_FEE;
  let tax = subtotal * TAX_PERCENT / 100;

  let discountAmount = discountType === "percent"
      ? subtotal * discountValue / 100
      : discountType === "flat"
      ? discountValue
      : 0;

  let total = subtotal + shipping + PLATFORM_FEE + tax - discountAmount;
  if(total < 0) total = 0;

  subtotalEl.textContent = "₹" + subtotal.toFixed(2);
  shippingEl.textContent = shipping === 0 ? "FREE" : "₹" + shipping;
  platformEl.textContent = "₹" + PLATFORM_FEE;
  taxEl.textContent = "₹" + tax.toFixed(2);
  discountEl.textContent = "- ₹" + discountAmount.toFixed(2);
  totalEl.textContent = "₹" + total.toFixed(2);
}

// =================== UPDATE CART COUNT ===================
function updateCartCount(){
  const totalItems = cart.reduce((sum, item) => {
    return sum + (Number(item.quantity) || 0);
  }, 0);

  cartCountEl.textContent = totalItems;
}

// =================== FORM SUBMISSION ===================
document.getElementById("checkout-form").addEventListener("submit", function(e){

  e.preventDefault();

  if(cart.length === 0){
    alert("Your cart is empty!");
    return;
  }

  const fullname = document.getElementById("fullname").value.trim();
  const email = document.getElementById("email").value.trim();
  const country = document.getElementById("country").value;
  const phoneCode = document.getElementById("phone-code").value;
  const phoneNumber = document.getElementById("phone").value.trim();
  const address = document.getElementById("address").value.trim();

  if(!fullname || !email || !phoneNumber || !address){
    alert("Please fill all required fields!");
    return;
  }

  alert("Order Placed Successfully! Thank you for shopping with ShopEase.");

  window.location.href = "payment.html";
});

// =================== INITIAL RENDER ===================
renderCheckoutCart();