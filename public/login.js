// const loginForm = document.getElementById("login-form");

// loginForm.addEventListener("submit", (e) => {

//   e.preventDefault();

//   const email = document.getElementById("login-email").value;

//   const password = document.getElementById("login-password").value;

//   const savedUser = JSON.parse(localStorage.getItem("user"));

//   if (
//     savedUser &&
//     savedUser.email === email &&
//     savedUser.password === password
//   ) {

//     alert("Login Successful!");

//     window.location.href = "index.html";

//   } else {

//     alert("Invalid Email or Password");

//   }

// });
const loginForm = document.getElementById("login-form");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email    = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value;

  if (!email || !password) {
    alert("Please enter email and password");
    return;
  }

  try {
    // Send to backend API
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (res.ok) {
      // Save token and basic user info
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify({
        name:  data.name,
        email: data.email,
        id:    data._id
      }));

      alert("✅ Login Successful!");
      window.location.href = "index.html";

    } else {
      // Show backend error (e.g. "Invalid email or password")
      alert(data.message || "Login failed. Try again.");
    }

  } catch (err) {
    alert("Server error. Please try again.");
    console.error(err);
  }
});