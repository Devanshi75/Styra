
// cart array
let cart=JSON.parse(localStorage.getItem("cart")) || [];
let products = [];

async function loadProducts() {
  try {
    const response = await fetch("/api/products");
    products = await response.json();
  } catch (error) {
    console.error("Failed to load products:", error);
  }
}

loadProducts();
// 2. TOTAL ELEMENTS (GET FROM DOM)
const cartSubtotal = document.getElementById("cart-subtotal");
const cartTotal = document.getElementById("cart-total");
const coupons = {
  SAVE10: 10,   
  SAVE20: 20,  
  FLAT5: 5      
};

let appliedCoupon = null;


// selecting all cart buttons

const cartButtons=document.querySelectorAll(".btn-cart, .add-cart-btn");
// click event
cartButtons.forEach((button) =>{
  button.addEventListener("click",(e) =>{
    e.preventDefault();
    // getting product id
    
    const productId = button.dataset.id;
    // finding product
    if (!products.length) {
  alert("Products are still loading");
  return;
}
    const selectedProduct=products.find((product) =>{
      return product._id === productId;
      

    });
    // adding product to cart and quantity logic
    const existingProduct=cart.find((product) =>{
      return product._id === productId;

    });
    // Read quantity from product detail page stepper when present
    const quantityInput = document.getElementById("product-quantity");
    const qtyToAdd = quantityInput
      ? Math.max(1, parseInt(quantityInput.value, 10) || 1)
      : 1;

    if(existingProduct){
      existingProduct.quantity += qtyToAdd;

    }
   else {

  if (!selectedProduct) {
    alert("Product not found");
    return;
  }

  cart.push({
    ...selectedProduct,
    quantity: qtyToAdd
  });

}

    
   
   localStorage.setItem("cart", JSON.stringify(cart));
    window.location.href = "cart.html";

  


  });

});
// cart render logic
function renderCart() {
  const cartItemsContainer = document.getElementById("cart-items");

  if (!cartItemsContainer) return;

  cartItemsContainer.innerHTML = "";

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `
      <tr>
        <td colspan="6">Your Cart is Empty</td>
      </tr>
    `;
    updateCartTotal();
    return;
  }
   cart.forEach(product => {
    cartItemsContainer.innerHTML += `
      <tr>
        <td>
          <a href="#" class="remove-btn" data-id="${product._id}">
          <i class="fa-regular fa-circle-xmark"></i>

          </a>
        </td>

        <td><img src="${product.image}" width="70"></td>

        <td>${product.name}</td>

        <td>₹${product.price}</td>

        <td>
          <input type="number" value="${product.quantity}" min="1"
            class="quantity-input" data-id="${product._id}">
        </td>

        <td>₹${product.price * product.quantity}</td>
      </tr>
    `;
  });
  attachEvents();      // remove + quantity events
  updateCartTotal();   // total update
  updateCartCount();
}
// attach events

function attachEvents() {
  // REMOVE BUTTON
  document.querySelectorAll(".remove-btn").forEach((btn) => {
    btn.onclick = (e) => {
      e.preventDefault();

     const id = btn.dataset.id;

      const product = cart.find(item => item._id === id);
      if (!product) return;
       if (product.quantity > 1) {
        product.quantity -= 1;
      } else {
        cart = cart.filter(item => item._id !== id);
      }

      localStorage.setItem("cart", JSON.stringify(cart));
      renderCart();
    };
  });
// quantity update
const quantityInputs = document.querySelectorAll(".quantity-input");

quantityInputs.forEach((input) => {
  input.addEventListener("change", () => {

   const id = input.dataset.id;

    const product = cart.find(item => item._id === id);
     if (!product) return;
    const newQuantity = Number(input.value);

if(newQuantity < 1){
  input.value = 1;
  product.quantity = 1;
}
else{
  product.quantity = newQuantity;
}

  

    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
  });
});
}
// 6. TOTAL PRICE

function updateCartTotal() {
  let subtotal = 0;

  cart.forEach((product) => {
    subtotal += product.price * product.quantity;
  });

  let discount = 0;

  if (appliedCoupon) {
    discount = (subtotal * coupons[appliedCoupon]) / 100;
  }

  let finalTotal = subtotal - discount;

  if (cartSubtotal) cartSubtotal.innerText = `₹${subtotal}`;
  if (cartTotal) cartTotal.innerText = `₹${finalTotal}`;
}



   
// CART COUNT BADGE
function updateCartCount(){

const cartCount=document.getElementById("cart-count");


if(cartCount){

  let totalItems=0;

  cart.forEach((product)=>{
    totalItems += product.quantity;
  });

  cartCount.innerText=totalItems;
}
}
renderCart();
// applying coupon
const couponInput = document.getElementById("coupon-input");
const applyBtn = document.getElementById("coupon-button");
const couponMsg = document.getElementById("coupon-msg") || null;
if (couponMsg) {
  couponMsg.innerText = "Invalid coupon code";
}

if (applyBtn) {
  applyBtn.addEventListener("click", () => {
    const code = couponInput.value.trim().toUpperCase();

    if (appliedCoupon) {
      couponMsg.innerText = "Coupon already applied!";
      return;
    }

    if (coupons[code]) {
      appliedCoupon = code;
      couponMsg.innerText = `Coupon applied: ${coupons[code]}% OFF`;
      couponMsg.style.color = "green";
    } else {
      couponMsg.innerText = "Invalid coupon code";
      couponMsg.style.color = "red";
    }

    updateCartTotal();
  });
}
// Checkout FUnctionality
const checkoutBtn = document.getElementById("checkout-btn");

if (checkoutBtn) {
  checkoutBtn.addEventListener("click", () => {

    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    window.location.href = "checkout.html";
  });
}



    
  

// ─── Wishlist buttons (replaces old localStorage version) ──────
const wishlistButtons = document.querySelectorAll(".wishlist-btn");

wishlistButtons.forEach((button) => {
  button.addEventListener("click", async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login to add to wishlist!");
      window.location.href = "login.html";
      return;
    }

    const productId = button.dataset.id;

    try {
      const res  = await fetch(`/api/wishlist/${productId}`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();

      if (res.ok) {
        alert("❤️ Added to wishlist!");
      } else {
        alert(data.message); // "Already in wishlist"
      }
    } catch (err) {
      alert("Failed. Try again.");
    }
  });
});

