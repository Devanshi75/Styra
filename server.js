const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json()); // parse JSON body

// Serve your existing HTML/CSS/JS frontend
app.use(express.static(path.join(__dirname, "public")));

// API Routes
app.use("/api/auth",     require("./routes/authRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/orders",   require("./routes/orderRoutes"));
app.use("/api/wishlist", require("./routes/wishlistRoutes"));

// Fallback: serve index.html for any unknown route
app.get("/{*path}", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));