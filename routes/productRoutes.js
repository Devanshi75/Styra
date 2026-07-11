const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
// GET /api/products
router.get("/", async (req, res) => {
  try {

    const filter = {};

    // filter products by section
    if (req.query.section) {
      filter.section = req.query.section;
    }

    const products = await Product.find(filter);

    res.json(products);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/products/:id — get single product
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/products — add product (for seeding/admin)
router.post("/", async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;