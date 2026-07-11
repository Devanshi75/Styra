const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const Product = require("./models/Product");

const products = [
  { name: "Men's Solid T-Shirt",    price: 699,  image: "/images/Men's fashion.jpg",   category: "Clothing",    description: "Premium cotton solid t-shirt." },
  { name: "Women's Casual Dress",   price: 999,  image: "/images/Women's fashion.jpg", category: "Clothing",    description: "Lightweight casual dress." },
  { name: "Kids Printed T-Shirt",   price: 399,  image: "/images/kids fashion.jpg",    category: "Clothing",    description: "Soft breathable printed t-shirt." },
  { name: "Formal Leather Shoes",   price: 799,  image: "/images/footwear.jpg",        category: "Footwear",    description: "Polished leather formal shoes." },
  { name: "Leather Crossbody Bag",  price: 299,  image: "/images/Bags1.jpg",           category: "Accessories", description: "Compact crossbody bag." },
  { name: "Classic Wristwatch",     price: 1199, image: "/images/Watches2.jpg",        category: "Accessories", description: "Minimalist quartz wristwatch." },
  { name: "Aviator Sunglasses",     price: 199,  image: "/images/Sunglasses2.jpg",     category: "Accessories", description: "UV-protected aviator sunglasses." },
  { name: "Baseball Cap",           price: 99,   image: "/images/Caps2.jpg",           category: "Accessories", description: "Adjustable cotton baseball cap." },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  await Product.deleteMany();
  await Product.insertMany(products);
  console.log("✅ Products seeded!");
  process.exit();
}
seed();