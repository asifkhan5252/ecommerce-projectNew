import dotenv from "dotenv";
dotenv.config();
import Razorpay from "razorpay";
import crypto from "crypto";
import Order from "../models/order.js";

// ✅ Check if keys are loaded
// console.log("✅ Loaded Razorpay Keys:");
// console.log("RAZORPAY_KEY_ID:", process.env.RAZORPAY_KEY_ID);
// console.log("RAZORPAY_KEY_SECRET:", process.env.RAZORPAY_KEY_SECRET);

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ✅ CREATE ORDER
export const createOrderController = async (req, res) => {
  try {
    const { amount } = req.body;
    // console.log("Amount received:", amount);

    const options = {
      amount: Math.round(amount), // in paisa
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    console.log("✅ Order created:", order.id);

    res.json({ success: true, order });
  } catch (error) {
    console.error("❌ Error creating order:", error);
    res.status(500).json({ success: false, message: "Failed to create Razorpay order" });
  }
};

// ✅ VERIFY PAYMENT
export const verifyPaymentController = async (req, res) => {
  console.log("Verify Payment Request Body:", req.body);

  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, cart, buyer, totalAmount } = req.body;
if (!buyer) {
  return res.status(400).json({ error: "Buyer ID is required" });
}
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    // console.log("expectedSignature:", expectedSignature);
    // console.log("razorpay_signature:", razorpay_signature);

    if (expectedSignature !== razorpay_signature) {
    //   console.log("❌ Signature mismatch");
      return res.status(400).json({ success: false, message: "Invalid signature" });
    }

    // ✅ Save verified order
    const order = await Order.create({
      buyer,              // from frontend (auth?.user?._id)
      cart,
      totalAmount,
      razorpay_order_id,
      razorpay_payment_id,
      paymentStatus: "Paid",
    });

    console.log("✅ Payment verified successfully:", order._id);
    res.json({ success: true, message: "Payment verified and order saved", order });
  } catch (error) {
    console.error("Payment verification error:", error);
    res.status(500).json({ success: false, message: "Verification failed", error: error.message });
  }
};