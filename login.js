    // =========================
    // 1. Show / Hide Password Toggle
    // =========================
    const toggles = document.querySelectorAll(".toggle-password");

    toggles.forEach(toggle => {
        toggle.addEventListener("click", function () {
            const input = this.previousElementSibling;

            if (input.type === "password") {
                input.type = "text";
                this.textContent = "Hide";
            } else {
                input.type = "password";
                this.textContent = "Show";
            }
        });
    });

const loginForm = document.getElementById("loginForm");
const emailInput = loginForm.email;
const passwordInput = loginForm.password;

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();

  clearErrors();

  let isValid = true;

  if (!emailInput.value.trim()) {
    showError(emailInput, "Email is required.");
    isValid = false;
  } else if (!validateEmail(emailInput.value.trim())) {
    showError(emailInput, "Please enter a valid email.");
    isValid = false;
  }

  if (!passwordInput.value.trim()) {
    showError(passwordInput, "Password is required.");
    isValid = false;
  } else if (passwordInput.value.length < 6) {
    showError(passwordInput, "Password must be at least 6 characters.");
    isValid = false;
  }

  if (isValid) {
    // Replace this with your real login logic or API call
    alert(`Welcome back, ${emailInput.value.trim()}!`);
    loginForm.reset();
  }
});

function showError(input, message) {
  const errorSpan = input.parentElement.querySelector(".error-message");
  errorSpan.textContent = message;
  input.setAttribute("aria-invalid", "true");
  input.focus();
}

function clearErrors() {
  const errorMessages = loginForm.querySelectorAll(".error-message");
  errorMessages.forEach((el) => (el.textContent = ""));
  emailInput.removeAttribute("aria-invalid");
  passwordInput.removeAttribute("aria-invalid");
}

function validateEmail(email) {
  // Simple email regex validation
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
