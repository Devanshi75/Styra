const wishlistContainer = document.getElementById("wishlist-items");
const token = localStorage.getItem("token");

// ─── If not logged in, show message ────────────────────────────
if (!token) {
  wishlistContainer.innerHTML = `
    <h3>Please <a href="login.html">login</a> to view your wishlist</h3>
  `;
} else {
  loadWishlist();
}

// ─── Fetch and render wishlist from backend ─────────────────────
async function loadWishlist() {
  try {
    const res      = await fetch("/api/wishlist", {
      headers: { "Authorization": `Bearer ${token}` }
    });
    const wishlist = await res.json();

    if (wishlist.length === 0) {
      wishlistContainer.innerHTML = "<h3>Your Wishlist is Empty</h3>";
      return;
    }

    wishlistContainer.innerHTML = "";

    wishlist.forEach((product) => {
      wishlistContainer.innerHTML += `
        <div class="wishlist-card">
          <img src="${product.image}" width="150">
          <h3>${product.name}</h3>
          <p>₹${product.price}</p>
          <button class="add-to-cart-from-wishlist" data-id="${product._id}">
            Add to Cart
          </button>
          <button class="remove-wishlist-btn" data-id="${product._id}">
            Remove
          </button>
        </div>
      `;
    });

  } catch (err) {
    wishlistContainer.innerHTML = "<h3>Failed to load wishlist</h3>";
    console.error(err);
  }
}

// ─── Use Event Delegation (single listener, no duplication) ─────
wishlistContainer.addEventListener("click", async (e) => {
  
  // Remove button clicked
  if (e.target.closest(".remove-wishlist-btn")) {
    const btn = e.target.closest(".remove-wishlist-btn");
    const productId = btn.dataset.id;
    try {
      await fetch(`/api/wishlist/${productId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      loadWishlist(); // re-render after removal
    } catch (err) {
      alert("Failed to remove. Try again.");
    }
  }

  // Add to cart button clicked
  if (e.target.closest(".add-to-cart-from-wishlist")) {
    const btn = e.target.closest(".add-to-cart-from-wishlist");
    const productId = btn.dataset.id;

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const card    = btn.closest(".wishlist-card");
    const name    = card.querySelector("h3").innerText;
    const priceEl = card.querySelector("p").innerText.replace("₹", "");
    const image   = card.querySelector("img").src;

    const existing = cart.find(item => item._id === productId);

    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ _id: productId, name, price: Number(priceEl), image, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert("✅ Added to cart!");
  }
});