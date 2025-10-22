
// models/orderModel.js
import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    products: [
  {
    type: mongoose.ObjectId,
    ref: "Products",
  },
],
    buyer: {
         type: mongoose.ObjectId,
          ref: "users",
    //   type: Object, // or { type: mongoose.Schema.Types.ObjectId, ref: "User" } if using users
      required: true,
    },
    cart: {
      type: Array,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    razorpay_order_id: String,
    razorpay_payment_id: String,
    // paymentStatus: {
    //   type: String,
    //   enum: ["Pending", "Paid"],
    //   default: "Pending",
    // },
    status: {
      type: String,
      enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);

