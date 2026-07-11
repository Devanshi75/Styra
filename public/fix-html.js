const fs = require("fs");
const path = require("path");

const ROOT = __dirname;

const DEAL_PRODUCTS = {
  1: { name: "Men's Pattern Shirt", category: "Clothing", new: 649, old: 799 },
  2: { name: "Women's Casual Dress", category: "Clothing", new: 899, old: 1099 },
  3: { name: "Kids Printed T-Shirt", category: "Clothing", new: 349, old: 449 },
  4: { name: "Aviator Sunglasses", category: "Accessories", new: 179, old: 249 },
  5: { name: "Leather Crossbody Bag", category: "Accessories", new: 249, old: 349 },
  6: { name: "Baseball Cap", category: "Accessories", new: 89, old: 119 },
  7: { name: "Classic Wristwatch", category: "Accessories", new: 999, old: 1299 },
  8: { name: "Formal Leather Shoes", category: "Footwear", new: 699, old: 899 },
};

const TITLES = {
  "shop.html": "Shop — Styra",
  "product.html": "Product — Styra",
  "contact.html": "Contact — Styra",
  "blog.html": "Blog — Styra",
  "about.html": "About — Styra",
  "cart.html": "Cart — Styra",
  "login.html": "Login — Styra",
  "signup.html": "Sign Up — Styra",
  "checkout.html": "Checkout — Styra",
  "wishlist.html": "Wishlist — Styra",
};

function updateDealBlock(block) {
  const match = block.match(/class="btn-cart" data-id="(\d+)"/);
  if (!match) return block;
  const product = DEAL_PRODUCTS[match[1]];
  block = block.replace(/<h5 class="Product-heading">.*?<\/h5>/, `<h5 class="Product-heading">${product.name}</h5>`);
  block = block.replace(/<span class="product-category">.*?<\/span>/, `<span class="product-category">${product.category}</span>`);
  block = block.replace(/<span class="new-price">.*?<\/span>/, `<span class="new-price">₹${product.new}</span>`);
  block = block.replace(/<span class="old-price">.*?<\/span>/, `<span class="old-price">₹${product.old}</span>`);
  block = block.replace(/href="product\.html\?id=(\d+)\s+"/g, 'href="product.html?id=$1"');
  return block;
}

function updateDeals(html) {
  return html.replace(/<div class="product-item">[\s\S]*?<\/div>\s*(?=\n(?:<!-- item|<\/div>))/g, updateDealBlock);
}

function applyCommon(text, filename) {
  if (TITLES[filename]) {
    text = text.replace(/<title>.*?<\/title>/, `<title>${TITLES[filename]}</title>`);
  }

  const replacements = [
    ["COntact", "Contact"],
    ['href=""login.html', "href=\"login.html"],
    ['<a href=""><img src="" alt="" class="logo"></a>', '<a href="index.html"><img src="" alt="Styra" class="logo"></a>'],
    ["<h5>contact-section</h5>", "<h5>Contact Us</h5>"],
    ["Sector-M,Ashiyana,Lucknows", "Sector M, Ashiyana, Lucknow"],
    ["<span>Hours:</span>10:00", "<span>Hours:</span> 10:00"],
    ["Terms&Conditions", "Terms &amp; Conditions"],
    ["Accesories", "Accessories"],
    ["JohnDOe", "John Doe"],
    ["Select SIze", "Select Size"],
    ['<li><a href="">About Us</a></li>', '<li><a href="about.html">About Us</a></li>'],
    ['<li><a href="">Contact Us</a></li>', '<li><a href="contact.html">Contact Us</a></li>'],
    ['<li><a href="">Sign in</a></li>', '<li><a href="login.html">Sign In</a></li>'],
    ['<li><a href="">View Cart</a></li>', '<li><a href="cart.html">View Cart</a></li>'],
    ['<li><a href="">My Wishlist</a></li>', '<li><a href="wishlist.html">My Wishlist</a></li>'],
    ['<h5><a href="">About</a></h5>', '<h5><a href="about.html">About</a></h5>'],
    ['<h5><a href="">My Account</a></h5>', '<h5><a href="login.html">My Account</a></h5>'],
    ["Starting From $399", "Starting From ₹399"],
    ["Starting From $599", "Starting From ₹599"],
    ["Starting From $199", "Starting From ₹199"],
    ["Starting From $499", "Starting From ₹499"],
    ["Starting From $99", "Starting From ₹99"],
  ];

  for (const [oldVal, newVal] of replacements) {
    text = text.split(oldVal).join(newVal);
  }

  text = text.replace(/href="product\.html\?id=(\d+)\s+"/g, 'href="product.html?id=$1"');
  text = text.replace(/\.jpg"width=/g, '.jpg" width=');
  text = text.replace(/\.jpeg"width=/g, '.jpeg" width=');

  if (text.includes("product-item")) {
    text = updateDeals(text);
  }

  if (filename === "index.html" || filename === "product.html") {
    text = text
      .split("<p class=\"product-name\">Men's Solid T-shirt</p>\n      <p>$699</p>").join("<p class=\"product-name\">Men's Solid T-Shirt</p>\n      <p>₹699</p>")
      .split("<p class=\"product-name\">Women Casual Dress</p>\n      <p>$699</p>").join("<p class=\"product-name\">Women's Casual Dress</p>\n      <p>₹999</p>")
      .split("<p class=\"product-name\">Kids Printed t-shirts</p>\n      <p>$699</p>").join("<p class=\"product-name\">Kids Printed T-Shirt</p>\n      <p>₹399</p>")
      .split("<p class=\"product-name\">formal shoes</p>\n      <p>$699</p>").join("<p class=\"product-name\">Formal Leather Shoes</p>\n      <p>₹799</p>")
      .split('<img src="images/Bags1.jpg" alt=""></div>\n      <p class="product-name">Men\'s Solid T-shirt</p>\n      <p>$699</p>').join('<img src="images/Bags1.jpg" alt="Leather crossbody bag"></div>\n      <p class="product-name">Leather Crossbody Bag</p>\n      <p>₹299</p>')
      .split('<img src="images/Watches2.jpg" alt=""></div>\n      <p class="product-name">Men\'s Solid T-shirt</p>\n      <p>$699</p>').join('<img src="images/Watches2.jpg" alt="Classic wristwatch"></div>\n      <p class="product-name">Classic Wristwatch</p>\n      <p>₹1199</p>')
      .split('<img src="images/Sunglasses2.jpg" alt=""></div>\n      <p class="product-name">Men\'s Solid T-shirt</p>\n      <p>$699</p>').join('<img src="images/Sunglasses2.jpg" alt="Aviator sunglasses"></div>\n      <p class="product-name">Aviator Sunglasses</p>\n      <p>₹199</p>')
      .split('<img src="images/Caps2.jpg" alt=""></div>\n      <p class="product-name">Men\'s Solid T-shirt</p>\n      <p>$699</p>').join('<img src="images/Caps2.jpg" alt="Baseball cap"></div>\n      <p class="product-name">Baseball Cap</p>\n      <p>₹99</p>')
      .split("<p>Men's Solid T-shirt</p>\n      <p>$699</p>").join("<p>Men's Solid T-Shirt</p>\n      <p>₹699</p>")
      .split("<p>Women Casual Dress</p>\n      <p>$699</p>").join("<p>Women's Casual Dress</p>\n      <p>₹999</p>")
      .split("<p>Kids Printed t-shirts</p>\n      <p>$699</p>").join("<p>Kids Printed T-Shirt</p>\n      <p>₹399</p>")
      .split("<p>formal shoes</p>\n      <p>$699</p>").join("<p>Formal Leather Shoes</p>\n      <p>₹799</p>")
      .split('<img src="images/Bags1.jpg" alt=""></div>\n      <p>Men\'s Solid T-shirt</p>\n      <p>$699</p>').join('<img src="images/Bags1.jpg" alt="Leather crossbody bag"></div>\n      <p>Leather Crossbody Bag</p>\n      <p>₹299</p>')
      .split('<img src="images/Watches2.jpg" alt=""></div>\n      <p>Men\'s Solid T-shirt</p>\n      <p>$699</p>').join('<img src="images/Watches2.jpg" alt="Classic wristwatch"></div>\n      <p>Classic Wristwatch</p>\n      <p>₹1199</p>')
      .split('<img src="images/Sunglasses2.jpg" alt=""></div>\n      <p>Men\'s Solid T-shirt</p>\n      <p>$699</p>').join('<img src="images/Sunglasses2.jpg" alt="Aviator sunglasses"></div>\n      <p>Aviator Sunglasses</p>\n      <p>₹199</p>')
      .split('<img src="images/Caps2.jpg" alt=""></div>\n      <p>Men\'s Solid T-shirt</p>\n      <p>$699</p>').join('<img src="images/Caps2.jpg" alt="Baseball cap"></div>\n      <p>Baseball Cap</p>\n      <p>₹99</p>');
  }

  if (filename === "contact.html") {
    text = text.replace('<input type="text" placeholder="E-mail">', '<input type="email" placeholder="Email">');
    text = text.replace('<textarea name="" id="" rows="5" cols="30">Your Message</textarea>', '<textarea name="message" id="message" rows="5" cols="30" placeholder="Your Message"></textarea>');
  }

  if (filename === "blog.html") {
    text = text.replace(/<p> Ladipisicing elit\.[\s\S]*?<\/p>/g, "<p>Discover the latest trends in fashion, styling tips, and seasonal wardrobe essentials from the Styra team.</p>");
    text = text.replace(/<h3>Lorem ipsum dolor sit\.<\/h3>/g, "<h3>Style Guide: Fresh Looks for the Season</h3>");
  }

  if (filename === "index.html") {
    text = text.replace(
      `<article class="category-card">
        <a href="#" class="card-link">

        <div class="img-box">
          <img src="images/WomenCollection.jpg" alt=""></div>
          <p>Women's Collection</p>
          <p>Starting From ₹599</p>
          
      </article>`,
      `<article class="category-card">
        <a href="#" class="card-link">
        <div class="img-box">
          <img src="images/WomenCollection.jpg" alt="Women's fashion collection"></div>
          <p>Women's Collection</p>
          <p>Starting From ₹599</p>
          </a>
      </article>`
    );
  }

  if (filename === "product.html") {
    text = text.replace("<h4 id=\"product-price\">$139.00</h4>", "<h4 id=\"product-price\">₹699</h4>");
    text = text.replace("<h4 id=\"product-name\">Men's Fashion Tshirt</h4>", "<h4 id=\"product-name\">Men's Solid T-Shirt</h4>");
    text = text.replace("<h6 id=\"product-category\">Home/T-shirt</h6>", "<h6 id=\"product-category\">Home / Clothing</h6>");
  }

  return text;
}

fs.readdirSync(ROOT)
  .filter((file) => file.endsWith(".html"))
  .forEach((file) => {
    const filePath = path.join(ROOT, file);
    const updated = applyCommon(fs.readFileSync(filePath, "utf8"), file);
    fs.writeFileSync(filePath, updated, "utf8");
    console.log("Updated " + file);
  });
