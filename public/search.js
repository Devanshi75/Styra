const params = new URLSearchParams(window.location.search);

const query = params.get("query");
if (!query) {
  document.getElementById("search-results").innerHTML =
    "<h3>Please enter a search term.</h3>";
  throw new Error("No search query");
}

async function searchProducts(){

const res = await fetch("/api/products");

const products = await res.json();


const result = products.filter(product =>

product.name.toLowerCase().includes(query.toLowerCase()) ||
  product.category.toLowerCase().includes(query.toLowerCase()) ||
  product.section.toLowerCase().includes(query.toLowerCase())

);


const container=document.getElementById("search-results");


container.innerHTML="";


if(result.length===0){

container.innerHTML="<h3>No products found</h3>";

return;

}


result.forEach(product=>{


container.innerHTML += `

<div class="product-item">

<img src="${product.image}" class="product-img">

<h5>${product.name}</h5>

<p>₹${product.price}</p>

</div>

`;


});


}


searchProducts();