
// ─── Load cart from localStorage ───────────────────────────────
let checkoutCart = JSON.parse(localStorage.getItem("cart")) || [];

const checkoutItems = document.getElementById("checkout-items");
const checkoutTotal = document.getElementById("checkout-total");

// ─── Render order summary (same as your original) ──────────────
function renderCheckout() {
  let total = 0;
  checkoutItems.innerHTML = "";

  checkoutCart.forEach(product => {
    total += product.price * product.quantity;
    checkoutItems.innerHTML += `
      <div class="checkout-product">
        <p>${product.name} × ${product.quantity}</p>
        <p>₹${product.price * product.quantity}</p>
      </div>
    `;
  });

  checkoutTotal.innerText = `₹${total}`;
}

renderCheckout();

// ─── Helper: get cart total ─────────────────────────────────────
function getTotalAmount() {
  return checkoutCart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

// ─── Form submit ────────────────────────────────────────────────
const checkoutForm = document.getElementById("checkout-form");

checkoutForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (checkoutCart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  // Read shipping details from form
  const shippingAddress = {
    fullName: document.getElementById("fullName").value,
    email:    document.getElementById("email").value,
    phone:    document.getElementById("phone").value,
    address:  document.getElementById("address").value,
  };

  const paymentMethod = document.getElementById("paymentMethod").value;
  const token         = localStorage.getItem("token");

  // ── Must be logged in ─────────────────────────────────────────
  if (!token) {
    alert("Please login first to place an order!");
    window.location.href = "login.html";
    return;
  }

  // ── Cash on Delivery flow ─────────────────────────────────────
  if (paymentMethod === "cod") {
    try {
      const res = await fetch("/api/orders/cod", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          items:           checkoutCart,
          totalAmount:     getTotalAmount(),
          shippingAddress,
          paymentMethod:   "cod"
        })
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.removeItem("checkoutCart");
        alert("✅ Order placed! Pay on delivery.");
        window.location.href = "index.html";
      } else {
        alert(data.message || "Something went wrong");
      }
    } catch (err) {
      alert("Server error. Try again.");
      console.error(err);
    }
    return;
  }

  // ── Razorpay flow ─────────────────────────────────────────────
  try {
    // Step 1: Ask backend to create a Razorpay order
    const res = await fetch("/api/orders/create-razorpay-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ totalAmount: getTotalAmount() })
    });

    const razorpayOrder = await res.json();

    // Step 2: Open Razorpay payment popup
    const options = {
      key:         "YOUR_RAZORPAY_KEY_ID",  // ← paste your test key here
      amount:      razorpayOrder.amount,     // in paise (backend already multiplied)
      currency:    "INR",
      name:        "Styra",
      description: "Fashion Purchase",
      order_id:    razorpayOrder.id,

      // Step 3: After payment success, save order to DB
      handler: async function (response) {
        const orderRes = await fetch("/api/orders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({
            items:                checkoutCart,
            totalAmount:          getTotalAmount(),
            shippingAddress,
            razorpayOrderId:      response.razorpay_order_id,
            razorpayPaymentId:    response.razorpay_payment_id,
            razorpaySignature:    response.razorpay_signature,
          })
        });

        const orderData = await orderRes.json();

        if (orderRes.ok) {
          localStorage.removeItem("checkoutCart");
          alert("✅ Payment successful! Order placed.");
          window.location.href = "index.html";
        } else {
          alert(orderData.message || "Payment done but order saving failed.");
        }
      },

      prefill: {
        name:    shippingAddress.fullName,
        email:   shippingAddress.email,
        contact: shippingAddress.phone,
      },

      theme: { color: "#333" }
    };

    const rzp = new Razorpay(options);
    rzp.open();

  } catch (err) {
    alert("Payment failed. Try again.");
    console.error(err);
  }
});