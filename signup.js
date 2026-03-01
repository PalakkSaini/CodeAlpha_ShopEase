document.addEventListener("DOMContentLoaded", function () {

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


    // =========================
    // 2. Form Validation
    // =========================
    const form = document.getElementById("signupForm");
    const emailInput = form.querySelector('input[type="email"]');
    const passwordInput = document.getElementById("password");
    const confirmInput = document.getElementById("confirmPassword");

    form.addEventListener("submit", function (e) {
        e.preventDefault();  // prevent default form submission

        let valid = true;

        // Clear previous error messages
        form.querySelectorAll(".error-message").forEach(err => err.textContent = "");

        // -------- Email Validation --------
        if (!emailInput.value.trim()) {
            emailInput.parentElement.querySelector(".error-message").textContent = "Email is required";
            valid = false;
        } else if (!/^\S+@\S+\.\S+$/.test(emailInput.value.trim())) {
            emailInput.parentElement.querySelector(".error-message").textContent = "Enter a valid email";
            valid = false;
        }

        // -------- Password Validation --------
        if (!passwordInput.value.trim()) {
            document.getElementById("passwordError").textContent = "Password is required";
            valid = false;
        } else if (passwordInput.value.trim().length < 6) {
            document.getElementById("passwordError").textContent = "Password must be at least 6 characters";
            valid = false;
        }

        // -------- Confirm Password Validation --------
        if (!confirmInput.value.trim()) {
            document.getElementById("confirmPasswordError").textContent = "Confirm password is required";
            valid = false;
        } else if (confirmInput.value.trim() !== passwordInput.value.trim()) {
            document.getElementById("confirmPasswordError").textContent = "Passwords do not match";
            valid = false;
        }

        // -------- If All Valid --------
        if (valid) {
            alert("Sign Up Successful!");
            form.reset();

            // Reset Show/Hide toggles
            toggles.forEach(toggle => toggle.textContent = "Show");

            // Reset input types to password
            passwordInput.type = "password";
            confirmInput.type = "password";
        }
    });

});
