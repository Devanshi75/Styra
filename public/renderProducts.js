
// Stores products separately for each section
let allProducts = {};

// CHANGE: Allows ProductPage.js to register products for cart/wishlist lookup
function registerStyraProducts(section, products) {
  allProducts[section] = products;
}
window.registerStyraProducts = registerStyraProducts;


// ─────────────────────────────────────────────
// LOAD PRODUCTS FROM BACKEND
// ─────────────────────────────────────────────

async function loadAndRenderProducts(containerId, section = "") {

  const container = document.getElementById(containerId);

  if (!container) return;


  container.innerHTML = "<p>Loading products...</p>";


  try {

    const url = section
      ? `/api/products?section=${section}`
      : `/api/products`;


    const res = await fetch(url);

    const products = await res.json();



    // Store products section-wise
    if (section) {

      allProducts[section] = products;

    } else {

      allProducts["all"] = products;

    }



    if (!products.length) {

      container.innerHTML = "<p>No products found.</p>";
      return;

    }



    container.innerHTML = "";



    products.forEach(product => {


      container.innerHTML += `

      <div class="product-item">


        <div class="product-banner">


          <a href="product.html?id=${product._id}" class="product-image">

            <img src="${product.image}" 
                 alt="${product.name}" 
                 class="product-img">

          </a>



          <div class="product-action">


            <a href="product.html?id=${product._id}" 
               class="action-btn">

              <i class="fa-regular fa-eye"></i>

            </a>



            <a href="#" 
               class="action-btn wishlist-btn"
               data-id="${product._id}">

              <i class="fa-regular fa-heart"></i>

            </a>


          </div>



          <div class="product-badge">

            ${section || "New"}

          </div>



        </div>




        <div class="product-content">


          <span class="product-category">

            ${product.category}

          </span>



          <a href="product.html?id=${product._id}">

            <h5 class="Product-heading">

              ${product.name}

            </h5>

          </a>



          <div class="product-price">

            <span class="new-price">

              ₹${product.price}

            </span>

          </div>



          <a href="#" 
             class="btn-cart"
             data-id="${product._id}">

             <i class="fa-solid fa-cart-shopping"></i>

          </a>


        </div>


      </div>

      `;


    });



  }

  catch(err){

    container.innerHTML =
    "<p>Failed to load products. Please try again.</p>";

    console.error(err);

  }

}





// ─────────────────────────────────────────────
// FIND PRODUCT FROM ALL SECTIONS
// ─────────────────────────────────────────────

function findProduct(productId){


  for(const section in allProducts){


    const product = allProducts[section]
      .find(p => p._id === productId);



    if(product){

      return product;

    }

  }


  return null;

}





// ─────────────────────────────────────────────
// CART + WISHLIST EVENTS
// ─────────────────────────────────────────────


document.addEventListener("click",(e)=>{



// ADD TO CART

if(e.target.closest(".btn-cart")){


  e.preventDefault();


  const btn = e.target.closest(".btn-cart");


  const productId = btn.dataset.id;


  const product = findProduct(productId);



  if(!product) return;



  let cart =
  JSON.parse(localStorage.getItem("cart")) || [];



  const existing =
  cart.find(item => item._id === productId);



  if(existing){

    existing.quantity++;

  }

  else{


    cart.push({

      ...product,

      quantity:1

    });


  }



  localStorage.setItem(
    "cart",
    JSON.stringify(cart)
  );



  alert(`✅ "${product.name}" added to cart!`);



  updateCartCount();


}




// ADD TO WISHLIST

if(e.target.closest(".wishlist-btn")){


  e.preventDefault();


  const btn =
  e.target.closest(".wishlist-btn");



  const token =
  localStorage.getItem("token");



  if(!token){

    alert("Please login to add to wishlist!");

    window.location.href="login.html";

    return;

  }



  const productId =
  btn.dataset.id;



  fetch(`/api/wishlist/${productId}`,{


    method:"POST",


    headers:{

      "Authorization":`Bearer ${token}`

    }


  })

  .then(async(res)=>{


    const data =
    await res.json();



    if(res.ok){

      alert("❤️ Added to wishlist!");

    }

    else{

      alert(data.message);

    }


  })

  .catch(err=>{


    console.error(err);

    alert("Failed. Try again.");


  });



}



});






// ─────────────────────────────────────────────
// SEARCH FUNCTIONALITY
// ─────────────────────────────────────────────
const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");

if (searchBtn && searchInput) {

  function performSearch() {
    const query = searchInput.value.trim();

    if (!query) return;

    window.location.href = `search.html?query=${encodeURIComponent(query)}`;
  }

  searchBtn.addEventListener("click", performSearch);

  searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      performSearch();
    }
  });

}







// ─────────────────────────────────────────────
// CART COUNT
// ─────────────────────────────────────────────


function updateCartCount(){


const cartCount =
document.getElementById("cart-count");


if(!cartCount) return;



const cart =
JSON.parse(localStorage.getItem("cart")) || [];



const totalItems =
cart.reduce(
(sum,item)=>sum+item.quantity,
0
);



cartCount.innerText =
totalItems;



}



updateCartCount();