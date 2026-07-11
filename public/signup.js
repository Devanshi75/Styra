// const signupForm = document.getElementById("signup-form");

// signupForm.addEventListener("submit", (e) => {

//   e.preventDefault();

//   const name = document.getElementById("signup-name").value;

//   const email = document.getElementById("signup-email").value;

//   const password = document.getElementById("signup-password").value;

//   const user = {
//     name,
//     email,
//     password
//   };

//   localStorage.setItem("user", JSON.stringify(user));

//   alert("Signup Successful!");

//   window.location.href = "login.html";
// });
const signupForm = document.getElementById("signup-form");

signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Read values from form
  const name     = document.getElementById("signup-name").value.trim();
  const email    = document.getElementById("signup-email").value.trim();
  const password = document.getElementById("signup-password").value;

  // Basic frontend check
  if (!name || !email || !password) {
    alert("Please fill all fields");
    return;
  }

  if (password.length < 6) {
    alert("Password must be at least 6 characters");
    return;
  }

  try {
    // Send to backend API
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password })
    });

    const data = await res.json();

    if (res.ok) {
      // Save token and user info (NO password saved anymore)
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify({
        name:  data.name,
        email: data.email,
        id:    data._id
      }));

      alert("✅ Account created successfully!");
      window.location.href = "index.html";

    } else {
      // Show backend error (e.g. "User already exists")
      alert(data.message || "Signup failed. Try again.");
    }

  } catch (err) {
    alert("Server error. Please try again.");
    console.error(err);
  }
});