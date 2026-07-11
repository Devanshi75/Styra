const express = require("express");
const router = express.Router();
const Razorpay = require("razorpay");
const crypto = require("crypto");
const Order = require("../models/Order");
const { protect } = require("../middleware/authMiddleware");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// POST /api/orders/create-razorpay-order
// Creates a Razorpay order (called before payment popup opens)
router.post("/create-razorpay-order", protect, async (req, res) => {
  const { totalAmount } = req.body;
  try {
    const options = {
      amount: totalAmount * 100, // Razorpay needs amount in paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };
    const razorpayOrder = await razorpay.orders.create(options);
    res.json(razorpayOrder);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/orders — save order after payment success
router.post("/", protect, async (req, res) => {
  const { items, totalAmount, couponApplied, discountAmount,
          shippingAddress, razorpayOrderId, razorpayPaymentId,
          razorpaySignature } = req.body;
  try {
    // Verify payment signature (security check)
    const body = razorpayOrderId + "|" + razorpayPaymentId;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpaySignature) {
      return res.status(400).json({ message: "Payment verification failed" });
    }

    const order = await Order.create({
      user: req.user._id,
      items,
      totalAmount,
      couponApplied,
      discountAmount,
      shippingAddress,
      razorpayOrderId,
      razorpayPaymentId,
      paymentStatus: "paid",
    });
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/orders/myorders — get logged-in user's orders
router.get("/myorders", protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/orders/cod — Cash on Delivery (no payment verification needed)
router.post("/cod", protect, async (req, res) => {
  const { items, totalAmount, shippingAddress } = req.body;
  try {
    const order = await Order.create({
      user: req.user._id,
      items,
      totalAmount,
      shippingAddress,
      paymentStatus: "pending",  // will be paid on delivery
      paymentMethod: "cod",
    });
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
module.exports = router;