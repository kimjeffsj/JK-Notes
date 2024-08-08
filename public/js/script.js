document.addEventListener("DOMContentLoaded", () => {
  // Navbar
  const navMenu = document.querySelector(".nav__menu");
  const navToggle = document.querySelector(".nav__toggle-btn");
  const navToggleIcon = document.querySelector(".nav__toggle-btn i");

  navToggle.onclick = () => {
    navMenu.classList.toggle("active");
    const isMenuOpen = navMenu.classList.contains("active");

    navToggleIcon.classList = isMenuOpen
      ? "fa-solid fa-xmark"
      : "fa-solid fa-bars-staggered";
  };

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

    // Clear error message
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

    // Clear error message
    registerForm.querySelectorAll("input").forEach((input) => {
      input.addEventListener("input", () => clearError(errorMessage));
    });
  }

  // PROFILE CHANGE HANDLING
  const profileForm = document.querySelector(".profile__form");
  if (profileForm) {
    const errorMessage = profileForm.querySelector(".form__error-message");

    profileForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const formData = new FormData(profileForm);
      const userData = Object.fromEntries(formData.entries());

      try {
        const response = await fetch(profileForm.action, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
          credentials: "include",
        });

        const data = await response.json();

        if (response.ok) {
          alert(data.message || "Profile updated successfully");
          window.location.reload();
        } else {
          showError(
            errorMessage,
            data.message || "Failed to update user profile"
          );
        }
      } catch (error) {
        console.error("Error updating profile:", error);
        showError(
          errorMessage,
          "Error updating user profile. Please try again."
        );
      }
    });
    // Clear error message
    profileForm.querySelectorAll("input").forEach((input) => {
      input.addEventListener("input", () => clearError(errorMessage));
    });
  }

  // Delete note confirmation
  const deleteForm = document.querySelector(".note-detail__alert");
  const deletePopup = document.querySelector(".deletePopup");
  const cancelBtn = document.querySelector(".cancelBtn");

  deletePopup.addEventListener("click", (e) => {
    e.preventDefault();
    deleteForm.style.display = "flex";
  });

  deleteForm.addEventListener("click", (e) => {
    if (e.target === deleteForm) {
      deleteForm.style.display = "none";
    }
  });

  cancelBtn.addEventListener("click", (e) => {
    e.preventDefault();
    deleteForm.style.display = "none";
  });

  // DELETE NOTE HANDLING
  const deleteBtn = document.querySelector(".deleteBtn");

  deleteBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    const noteId = window.location.pathname.split("/").pop();
    try {
      const response = await fetch(`/notes/${noteId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        window.location.href = "/notes";
      } else {
        const data = await response.json();
        alert(data.message || "An error occurred. Please try again.");
      }
    } catch (error) {
      alert("An error occurred. Please try again.");
    }
  });
});

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
