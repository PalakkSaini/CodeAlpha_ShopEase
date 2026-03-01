// Generate Random Order ID
function generateOrderId() {
    return "ORD-" + Math.floor(100000 + Math.random() * 900000);
}

document.getElementById("orderId").textContent = generateOrderId();

// Confetti Effect (auto remove after 4 sec)
const colors = ['#ffcc00', '#ff5c5c', '#36d7b7', '#ff7eb9', '#9b59b6'];

for (let i = 0; i < 40; i++) {
    const confetti = document.createElement('div');
    confetti.style.position = "fixed";
    confetti.style.width = "8px";
    confetti.style.height = "8px";
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.top = "-10px";
    confetti.style.left = Math.random() * window.innerWidth + "px";
    confetti.style.opacity = Math.random();
    confetti.style.animation = `fall ${2 + Math.random() * 2}s linear`;
    document.body.appendChild(confetti);

    setTimeout(() => confetti.remove(), 4000);
}

const style = document.createElement('style');
style.innerHTML = `
@keyframes fall {
    to {
        transform: translateY(100vh) rotate(360deg);
        opacity: 0;
    }
}
`;
document.head.appendChild(style);
