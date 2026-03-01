// ================= DYNAMIC HERO TEXT =================
document.addEventListener("DOMContentLoaded", function () {
    const texts = ["ShopEase", "Best Deals", "Your One-Stop Shop", "Amazing Savings", "Exclusive Offers", "Fresh Arrivals"];
    const container = document.querySelector(".dynamic-text");

    if (!container) return;

    container.innerHTML = "";

    texts.forEach((txt, i) => {
        const span = document.createElement("span");
        span.textContent = txt;
        if (i === 0) span.classList.add("active");
        container.appendChild(span);
    });

    let index = 0;
    setInterval(() => {
        const spans = container.querySelectorAll("span");
        spans.forEach(span => span.classList.remove("active"));
        index = (index + 1) % spans.length;
        spans[index].classList.add("active");
    }, 1000);
});


// ================= FEATURED & SUGGESTED PRODUCTS =================
const featuredProducts = [
    { name: "Smartphone X1", price: 49999, img: "Images/S24 ultra.jfif" },
    { name: "Laptop Pro", price: 89999, img: "Images/MacBook Air.jfif" },
    { name: "Wireless Headphones", price: 5199, img: "Images/Apple headphone.jfif" },
    { name: "Smart Watch", price: 2149, img: "Images/Apple Watch.jfif" }
];

const suggestedProducts = [
    { name: "Running Shoes", price: 1270, img: "Images/Nike sneaker.jfif" },
    { name: "Bluetooth Speaker", price: 2120, img: "Images/Speaker.jfif" },
    { name: "Backpack", price: 1160, img: "Images/Backpack.jfif" },
    { name: "Fitness Band", price: 999, img: "Images/Band.jfif" }
];

function displayProducts(products, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = "";

    products.forEach(product => {
        const card = document.createElement("div");
        card.classList.add(containerId === "productGrid" ? "product-card" : "suggested-card");

        card.innerHTML = `
    <img src="${product.img}" alt="${product.name}">
    <h4>${product.name}</h4>
    <p class="price">₹${product.price}</p>
    <button>Add to Cart</button>
`;
        container.appendChild(card);
    });
}

document.addEventListener("DOMContentLoaded", function () {
    displayProducts(featuredProducts, "productGrid");
    displayProducts(suggestedProducts, "suggestedGrid");
});


// ================= CAROUSEL FUNCTIONALITY =================
document.addEventListener("DOMContentLoaded", function () {
    const track = document.querySelector('.carousel-track');
    if (!track) return;

    const slides = Array.from(track.children);
    const nextButton = document.querySelector('.right-arrow');
    const prevButton = document.querySelector('.left-arrow');
    const dotsNav = document.querySelector('.carousel-nav');
    const dots = Array.from(dotsNav.children);

    const slideWidth = slides[0].getBoundingClientRect().width;
    slides.forEach((slide, index) => slide.style.left = slideWidth * index + 'px');

    const moveToSlide = (currentSlide, targetSlide) => {
        track.style.transform = 'translateX(-' + targetSlide.style.left + ')';
        currentSlide.classList.remove('current-slide');
        targetSlide.classList.add('current-slide');
    };

    prevButton.addEventListener('click', () => {
        const currentSlide = track.querySelector('.current-slide');
        const prevSlide = currentSlide.previousElementSibling;
        if (!prevSlide) return;
        moveToSlide(currentSlide, prevSlide);
    });

    nextButton.addEventListener('click', () => {
        const currentSlide = track.querySelector('.current-slide');
        const nextSlide = currentSlide.nextElementSibling;
        if (!nextSlide) return;
        moveToSlide(currentSlide, nextSlide);
    });
});


// ================= DROPDOWN TOGGLE =================
document.addEventListener("DOMContentLoaded", function () {
    const dropdown = document.querySelector(".dropdown");
    if (!dropdown) return;

    const dropdownContent = dropdown.querySelector(".dropdown-content");
    const dropbtn = dropdown.querySelector(".dropbtn");

    dropbtn.addEventListener("click", function (e) {
        e.preventDefault();
        dropdownContent.style.display =
            dropdownContent.style.display === "block" ? "none" : "block";
    });

    document.addEventListener("click", function (e) {
        if (!dropdown.contains(e.target)) {
            dropdownContent.style.display = "none";
        }
    });
});


// ================= ADD TO CART FUNCTIONALITY (FIXED) =================
document.addEventListener("DOMContentLoaded", function () {

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartCount = document.getElementById("cartCount");

    function saveCart() {
        localStorage.setItem("cart", JSON.stringify(cart));
    }

    function updateCartCount() {
        const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
        if (cartCount) cartCount.textContent = totalItems;
        saveCart();
    }

    updateCartCount();

    document.addEventListener("click", function (e) {

        if (e.target.tagName === "BUTTON" && e.target.innerText.trim() === "Add to Cart") {

            const card = e.target.closest(".product-card, .suggested-card, .combo-card");
            if (!card) return;

            const name =
                card.querySelector("h4")?.innerText ||
                card.querySelector("h3")?.innerText ||
                "Product";

            const image = card.querySelector("img")?.src || "";

            // 🔥 Safe price extraction (works with old-price span too)
            let price = 0;
            const priceElement = card.querySelector(".price") || card.querySelector("p");

            if (priceElement) {
                const numbers = priceElement.innerText.match(/\d+/g);
                if (numbers && numbers.length > 0) {
                    price = parseFloat(numbers[0]);
                }
            }

            if (isNaN(price)) price = 0;

            const existingItem = cart.find(item => item.name === name);

            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({
                    id: Date.now(),
                    name: name,
                    price: price,
                    image: image,
                    quantity: 1
                });
            }

            updateCartCount();

            alert(name + " added to cart!");
        }
    });
});