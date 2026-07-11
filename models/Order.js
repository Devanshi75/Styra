const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      name:      String,
      price:     Number,
      quantity:  Number,
      image:     String,
    }
  ],

  totalAmount:     { type: Number, required: true },
  couponApplied:   { type: String, default: null },
  discountAmount:  { type: Number, default: 0 },

  paymentStatus:   { type: String, enum: ["pending", "paid", "failed"], default: "pending" },
  paymentMethod: { type: String, enum: ["razorpay", "cod"], default: "razorpay" },
  razorpayOrderId: { type: String },
  razorpayPaymentId:{ type: String },

  shippingAddress: {
    fullName: String,
    email:    String,
    address:  String,
    city:     String,
    pincode:  String,
    phone:    String,
  },

  status: { type: String, enum: ["processing", "shipped", "delivered"], default: "processing" },

}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);