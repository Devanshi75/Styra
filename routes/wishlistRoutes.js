const express = require("express");
const router  = express.Router();
const User    = require("../models/User");
const { protect } = require("../middleware/authMiddleware");

// GET /api/wishlist — get logged-in user's wishlist
router.get("/", protect, async (req, res) => {
  try {
    // populate means: fetch full product details, not just IDs
    const user = await User.findById(req.user._id).populate("wishlist");
    res.json(user.wishlist);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/wishlist/:productId — add product to wishlist
router.post("/:productId", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    // Check if already in wishlist
    if (user.wishlist.includes(req.params.productId)) {
      return res.status(400).json({ message: "Already in wishlist" });
    }

    user.wishlist.push(req.params.productId);
    await user.save();

    res.json({ message: "Added to wishlist" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/wishlist/:productId — remove from wishlist
router.delete("/:productId", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    user.wishlist = user.wishlist.filter(
      (id) => id.toString() !== req.params.productId
    );

    await user.save();
    res.json({ message: "Removed from wishlist" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;