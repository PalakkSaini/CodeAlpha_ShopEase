// // ============================
// // Currency Formatter
// // ============================
// const currency = amt =>
//   "₹" + Number(amt).toFixed(2);

// // ============================
// // Toast
// // ============================
// const showToast = (msg) => {
//   const toast = document.getElementById("toast");
//   if (!toast) return;
//   toast.textContent = msg;
//   toast.classList.add("show");
//   setTimeout(() => toast.classList.remove("show"), 2000);
// };

// // ============================
// // Timeline
// // ============================
// const renderTimeline = (status = "Ordered") => {
//   const steps = ["Ordered", "Shipped", "Delivered"];
//   return steps
//     .map(
//       s =>
//         `<div class="${steps.indexOf(s) <= steps.indexOf(status) ? "active" : ""}">${s}</div>`
//     )
//     .join("");
// };

// // ============================
// // Initialize Page
// // ============================
// document.addEventListener("DOMContentLoaded", function () {

//   const wrapper = document.getElementById("ordersWrapper");
//   const loader = document.getElementById("loader");

//   if (!wrapper) return;

//   const orders = JSON.parse(localStorage.getItem("orders")) || [];

//   if (loader) loader.remove();

//   if (!orders.length) {
//     wrapper.innerHTML += "<h2>No Orders Found</h2>";
//     return;
//   }

//   orders.reverse().forEach(order => {

//     let subtotal = 0;

//     let items = order.items || [];

//     if (!items.length && order.product) {
//       items = [{
//         name: order.product,
//         price: order.price,
//         quantity: 1,
//         image: order.image
//       }];
//     }

//     const rows = items.map(item => {

//       let price = Number(String(item.price).replace(/[₹,]/g, "")) || 0;
//       let qty = Number(item.quantity) || 1;
//       let total = price * qty;
//       subtotal += total;

//       return `
//         <tr>
//           <td>
//             <div class="product-cell">
//               <img src="${item.image}" width="50">
//               ${item.name}
//             </div>
//           </td>
//           <td>${currency(price)}</td>
//           <td>${qty}</td>
//           <td>${currency(total)}</td>
//         </tr>
//       `;
//     }).join("");

//     const card = document.createElement("div");
//     card.className = "card";

//     card.innerHTML = `
//       <div class="header">
//         <div>
//           <h3>Order #<span class="orderId">${order.id}</span></h3>
//           <p>${order.date || ""}</p>
//         </div>
//         <div>
//           <span class="badge status-ordered">Ordered</span>
//           <span class="payment payment-paid">Paid</span>
//         </div>
//       </div>

//       <div class="timeline">
//         ${renderTimeline(order.status || "Ordered")}
//       </div>

//       <table>
//         <thead>
//           <tr>
//             <th>Product</th>
//             <th>Price</th>
//             <th>Qty</th>
//             <th>Total</th>
//           </tr>
//         </thead>
//         <tbody>
//           ${rows}
//         </tbody>
//       </table>

//       <div class="summary">
//         <div><span>Subtotal</span><span>${currency(subtotal)}</span></div>
//         <div class="total"><span>Total</span><span>${currency(subtotal)}</span></div>

//         <div class="actions">
//           <button class="danger cancelBtn">Cancel Order</button>
//           <button class="invoiceBtn">Download Invoice</button>
//           <button class="copyBtn">Copy Order ID</button>
//         </div>
//       </div>
//     `;

//     wrapper.appendChild(card);
//   });

//   // ================= CANCEL ORDER =================
//   document.querySelectorAll(".cancelBtn").forEach(btn => {
//     btn.addEventListener("click", function () {

//       const card = this.closest(".card");
//       const orderId = card.querySelector(".orderId").textContent;

//       let orders = JSON.parse(localStorage.getItem("orders")) || [];

//       orders = orders.map(order => {
//         if (order.id === orderId) {
//           order.status = "Cancelled";
//         }
//         return order;
//       });

//       localStorage.setItem("orders", JSON.stringify(orders));

//       const badge = card.querySelector(".badge");
//       badge.textContent = "Cancelled";
//       badge.className = "badge status-cancelled";

//       this.remove();

//       showToast("Order Cancelled");
//     });
//   });

//   // ================= COPY ORDER ID =================
//   document.querySelectorAll(".copyBtn").forEach(btn => {
//     btn.addEventListener("click", function () {

//       const orderId = this.closest(".card")
//         .querySelector(".orderId").textContent;

//       navigator.clipboard.writeText(orderId).then(() => {
//         showToast("Order ID copied!");
//       });
//     });
//   });

//   // ================= DOWNLOAD INVOICE =================
//   document.querySelectorAll(".invoiceBtn").forEach(btn => {
//     btn.addEventListener("click", function () {

//       const card = this.closest(".card");
//       const orderId = card.querySelector(".orderId").textContent;

//       const { jsPDF } = window.jspdf;
//       const doc = new jsPDF();

//       doc.setFontSize(18);
//       doc.text(`Invoice - Order #${orderId}`, 20, 20);

//       let y = 40;

//       card.querySelectorAll("tbody tr").forEach(row => {
//         const cells = row.querySelectorAll("td");
//         doc.text(
//           `${cells[0].textContent} | Qty: ${cells[2].textContent} | ${cells[3].textContent}`,
//           20,
//           y
//         );
//         y += 10;
//       });

//       doc.save(`Invoice_${orderId}.pdf`);

//       showToast("Invoice Downloaded");
//     });
//   });

// });

// ================= CURRENCY =================
const currency = (amt) => "₹" + Number(amt).toFixed(2);

// ================= TOAST =================
function showToast(msg) {
  const t = document.getElementById("toast");
  if (!t) return;
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 2000);
}

// ================= TIMELINE =================
function renderTimeline(status) {
  const steps = ["Ordered", "Shipped", "Delivered"];
  return steps
    .map(s => {
      const active = steps.indexOf(s) <= steps.indexOf(status);
      return `<div class="${active ? "active" : ""}">${s}</div>`;
    })
    .join("");
}

document.addEventListener("DOMContentLoaded", function () {

  const wrapper = document.getElementById("ordersWrapper");
  const loader = document.getElementById("loader");

  if (!wrapper) return;

  let orders = JSON.parse(localStorage.getItem("orders")) || [];

  if (loader) loader.remove();

  if (orders.length === 0) {
    wrapper.innerHTML = "<h2>No Orders Found</h2>";
    return;
  }

  wrapper.innerHTML = "";

  const safeOrders = [...orders].reverse();

  safeOrders.forEach((order, index) => {

    if (!order.status) order.status = "Ordered";

    let subtotal = 0;

    let itemsArray = Array.isArray(order.items)
      ? order.items
      : [{
        name: order.product,
        price: order.price,
        quantity: order.quantity || 1,
        image: order.image
      }];

    const rows = itemsArray.map(item => {

      const price = Number(String(item.price).replace(/[₹,]/g, "")) || 0;
      const qty = Number(item.quantity) || 1;
      const total = price * qty;

      subtotal += total;

      return `
        <tr>
          <td>
            <div class="product-cell">
              <img src="${item.image}" width="50">
              ${item.name}
            </div>
          </td>
          <td>${currency(price)}</td>
          <td>${qty}</td>
          <td>${currency(total)}</td>
        </tr>
      `;
    }).join("");

    const isDelivered = order.status === "Delivered";
    const isCancelled = order.status === "Cancelled";

    // ✅ Only show cancel button if NOT delivered and NOT cancelled
    const cancelButton =
      !isDelivered && !isCancelled
        ? `<button class="danger cancelBtn">Cancel Order</button>`
        : "";

    const ratingSection =
      isDelivered
        ? `
        <div class="rating-section">
          <p><strong>Rate this Product:</strong></p>
          <div class="stars" data-id="${order.id}">
            ${[1, 2, 3, 4, 5].map(i =>
          `<span class="star ${order.rating >= i ? "active" : ""}" data-value="${i}">★</span>`
        ).join("")}
          </div>
        </div>`
        : "";

    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <div class="header">
        <div>
          <h3>Order #<span class="orderId">${order.id}</span></h3>
          <p>${order.date || ""}</p>
        </div>
        <div>
          <span class="badge status-${order.status.toLowerCase()}">
            ${order.status}
          </span>
          <span class="payment payment-paid">Paid</span>
        </div>
      </div>

      <div class="timeline">
        ${renderTimeline(order.status)}
      </div>

      <table>
        <thead>
          <tr>
            <th>Product</th>
            <th>Price</th>
            <th>Qty</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>

      <div class="summary">
        <div>
          <span>Total</span>
          <span>${currency(subtotal)}</span>
        </div>

        ${ratingSection}

        <div class="actions">
          ${cancelButton}
          <button class="invoiceBtn">Download Invoice</button>
          <button class="copyBtn">Copy Order ID</button>
        </div>
      </div>
    `;

    wrapper.appendChild(card);
  });

  // ================= CANCEL =================
  document.querySelectorAll(".cancelBtn").forEach(btn => {
    btn.addEventListener("click", function () {

      const card = this.closest(".card");
      const orderId = card.querySelector(".orderId").textContent;

      let orders = JSON.parse(localStorage.getItem("orders")) || [];

      orders = orders.map(order => {
        if (order.id === orderId) {
          order.status = "Cancelled";
        }
        return order;
      });

      localStorage.setItem("orders", JSON.stringify(orders));

      location.reload(); // clean refresh (no duplicate UI)
    });
  });

  // ================= COPY =================
  document.querySelectorAll(".copyBtn").forEach(btn => {
    btn.addEventListener("click", function () {
      const id = this.closest(".card")
        .querySelector(".orderId").textContent;
      navigator.clipboard.writeText(id);
      showToast("Order ID Copied!");
    });
  });

});