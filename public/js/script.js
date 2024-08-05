document.addEventListener("DOMContentLoaded", () => {
  // Error message handling
  function showError(errorElement, message) {
    if (errorElement) {
      errorElement.textContent = message;
      errorElement.style.display = "block";
    }
  }

  function clearError(errorElement) {
    if (errorElement) {
      errorElement.style.display = "none";
    }
  }

  // Login form handling
  const loginForm = document.querySelector(".login__form");
  if (loginForm) {
    const errorMessage = loginForm.querySelector(".form__error-message");

    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const formData = new FormData(loginForm);
      const userData = Object.fromEntries(formData.entries());

      try {
        const response = await fetch("/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        });
        if (response.ok) {
          window.location.href = "/home";
        } else {
          const data = await response.json();
          showError(
            errorMessage,
            data.message || "Login failed. Please try again."
          );
        }
      } catch (error) {
        showError(errorMessage, "An error occurred. Please try again.");
      }
    });

    // Clear error message when user starts typing in any input field
    loginForm.querySelectorAll("input").forEach((input) => {
      input.addEventListener("input", () => clearError(errorMessage));
    });
  }

  // Registration form handling
  const registerForm = document.querySelector(".register__form");
  if (registerForm) {
    const errorMessage = registerForm.querySelector(".form__error-message");

    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = new FormData(registerForm);
      const userData = Object.fromEntries(formData.entries());
      try {
        const response = await fetch("/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        });
        const data = await response.json();
        if (response.ok) {
          alert("Registration successful. Please Login");
          window.location.href = "/login";
        } else {
          showError(errorMessage, data.message || "Registration failed");
        }
      } catch (error) {
        console.error("Error:", error);
        showError(errorMessage, "An error occurred. Please try again.");
      }
    });

    // Clear error message when user starts typing in any input field
    registerForm.querySelectorAll("input").forEach((input) => {
      input.addEventListener("input", () => clearError(errorMessage));
    });
  }
});
