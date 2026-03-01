// =================== CART & FEES ===================
let cart = JSON.parse(localStorage.getItem("cart")) || [];

const SHIPPING_FEE = 100;
const PLATFORM_FEE = 49;
const TAX_PERCENT = 5;

let discountValue = 0;
let discountType = null;


// =================== DOM ELEMENTS ===================
const paymentCartContainer = document.getElementById("payment-cart-items");
const subtotalEl = document.getElementById("subtotal");
const shippingEl = document.getElementById("shipping");
const platformEl = document.getElementById("platform");
const taxEl = document.getElementById("tax");
const totalEl = document.getElementById("total");
const discountEl = document.getElementById("discount");
const cartCountEl = document.getElementById("cart-count");
const cardDetails = document.getElementById("card-details");
const upiDetails = document.getElementById("upi-details");
const paymentForm = document.getElementById("payment-form");


// =================== HELPER: UPI VALIDATION ===================
function isValidUPI(upi) {
  const regex = /^[\w.-]+@[\w]+$/;
  return regex.test(upi);
}


// =================== RENDER CART ===================
function renderPaymentCart() {
  paymentCartContainer.innerHTML = "";

  if(cart.length === 0){
    paymentCartContainer.innerHTML = "<p>Your cart is empty 🛒</p>";
  }

  cart.forEach(item => {
    const div = document.createElement("div");
    div.classList.add("cart-item-summary");

    div.innerHTML = `
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">
        <img src="${item.image}" width="60">
        <div>
          <p><strong>${item.name}</strong></p>
          <p>₹${item.price} × ${item.quantity}</p>
        </div>
      </div>
    `;

    paymentCartContainer.appendChild(div);
  });

  updateTotals();
  updateCartCount();
}


// =================== UPDATE TOTALS ===================
function updateTotals(){
  let subtotal = 0;

  cart.forEach(item => {
    subtotal += item.price * item.quantity;
  });

  let shipping = subtotal > 5000 ? 0 : SHIPPING_FEE;
  let tax = subtotal * TAX_PERCENT / 100;

  let discountAmount =
      discountType === "percent"
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
  const totalItems = cart.reduce((sum,item)=>sum+item.quantity,0);
  cartCountEl.textContent = totalItems;
}


// =================== SHOW/HIDE PAYMENT FIELDS ===================
paymentForm.addEventListener("change", function(e){
  if(e.target.name === "payment-method"){
    if(e.target.value === "card"){
      cardDetails.style.display = "block";
      upiDetails.style.display = "none";
    } else if(e.target.value === "upi"){
      cardDetails.style.display = "none";
      upiDetails.style.display = "block";
    } else {
      cardDetails.style.display = "none";
      upiDetails.style.display = "none";
    }
  }
});


// =================== PAYMENT SUBMISSION ===================
paymentForm.addEventListener("submit", function(e){
  e.preventDefault();

  if(cart.length === 0){
    alert("Your cart is empty!");
    return;
  }

  const selectedMethod = document.querySelector('input[name="payment-method"]:checked');
  if(!selectedMethod){
    alert("Please select a payment method!");
    return;
  }

  let paymentMethod = selectedMethod.value;

  if(paymentMethod === "card"){
    const cardNumber = document.getElementById("card-number").value.trim();
    const cardName = document.getElementById("card-name").value.trim();
    const expiry = document.getElementById("expiry").value.trim();
    const cvv = document.getElementById("cvv").value.trim();

    if(!cardNumber || !cardName || !expiry || !cvv){
      alert("Please fill all card details!");
      return;
    }

  } else if(paymentMethod === "upi"){
    const upiId = document.getElementById("upi-id").value.trim();

    if(!upiId){
      alert("Please enter your UPI ID!");
      return;
    }

    if(!isValidUPI(upiId)){
      alert("Invalid UPI ID! Format should be username@bank");
      return;
    }
  }

  // ================= SAVE ORDER =================
  let orders = JSON.parse(localStorage.getItem("orders")) || [];

  const newOrder = {
    id: "ORD" + Date.now(),
    date: new Date().toLocaleString(),
    items: cart,
    subtotal: subtotalEl.textContent,
    shipping: shippingEl.textContent,
    tax: taxEl.textContent,
    total: totalEl.textContent,
    status: "Processing"
  };

  orders.push(newOrder);
  localStorage.setItem("orders", JSON.stringify(orders));

  // ================= CLEAR CART =================
  localStorage.removeItem("cart");
  cart = [];

  alert("Payment Successful! Thank you for shopping with ShopEase.");

  window.location.href = "thankyou.html";
});


// =================== INITIAL RENDER ===================
renderPaymentCart();