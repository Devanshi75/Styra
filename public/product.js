
let products = []; // will be filled from API

async function loadProducts() {
  try {
    const res = await fetch("/api/products");
    products = await res.json();
    renderCart(); // re-render after loading
  } catch (err) {
    console.error("Failed to load products", err);
  }
}
loadProducts();