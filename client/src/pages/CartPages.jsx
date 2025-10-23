import React, { useState } from "react";
import Layouts from "../components/Layout/Layouts";
import { useCart } from "../Context/Cart";
import { useAuth } from "../Context/Auth";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import toast from "react-hot-toast";
import axios from "axios";

const CartPages = () => {
  const [cart, setCart] = useCart();
  const [auth] = useAuth();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ✅ Backend URL
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const loadScript = (src) =>
    new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const totalPrice = () =>
    cart.reduce(
      (acc, item) => acc + Number(item.price) * (Number(item.quantity) || 1),
      0
    );

  const removeFromCart = (id) => {
    const updatedCart = cart.filter((item) => item._id !== id);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    toast.success("Item removed from cart");
  };

  const handlePayment = async () => {
    setLoading(true);

    const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
    if (!res) {
      toast.error("Razorpay SDK failed to load.");
      setLoading(false);
      return;
    }

    const totalAmount = Math.round(totalPrice() * 100);
    if (totalAmount < 100) {
      toast.error("Amount must be at least ₹1");
      setLoading(false);
      return;
    }

    if (!auth?.user?.id) {
      toast.error("User not authenticated!");
      setLoading(false);
      navigate("/login", { state: { from: "/cart" } });
      return;
    }

    try {
      const { data } = await axios.post(`${apiUrl}/api/payment/order`, {
        amount: totalAmount,
      });

      if (!data.order || !data.order.id) {
        toast.error("Failed to create order.");
        setLoading(false);
        return;
      }

      const options = {
        key: "rzp_test_RRJy2fJaHOJtAN",
        amount: data.order.amount,
        currency: "INR",
        name: auth.user.name || "Customer",
        description: "Order Payment",
        order_id: data.order.id,
        prefill: {
          name: auth.user.name || "Customer",
          email: auth.user.email || "test@example.com",
          contact: auth.user.phone || "9999999999",
        },
        theme: { color: "#ED765CFF" },
        handler: async function (response) {
          try {
            await axios.post(`${apiUrl}/api/payment/verify`, {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              cart,
              buyer: auth.user.id,
              totalAmount: totalPrice(),
            });

            toast.success("Payment Successful!");
            localStorage.removeItem("cart");
            setCart([]);
            navigate("/dash/user/order");
          } catch (error) {
            console.error("Payment verification error:", error);
            toast.error("Payment verification failed!");
          }
        },
        modal: { escape: true },
        method: {
          card: true,
          netbanking: true,
          upi: true,
          wallet: true,
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Payment initiation error:", error.response || error);
      toast.error("Payment initiation failed!");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = () => {
    if (!auth?.user?.Address) {
      toast.error("Please login to checkout");
      navigate("/login", { state: { from: "/cart" } });
    } else {
      navigate("/checkout");
    }
  };

  return (
    <Layouts>
      <div className="container py-4">
        <h2 className="mb-4">Shopping Cart</h2>
        <div className="row">
          <div className="col-md-8">
            {cart.length === 0 ? (
              <p>
                Your cart is empty. <Link to="/">Continue Shopping</Link>
              </p>
            ) : (
              cart.map((item, index) => (
                <div
                  key={`${item._id}-${index}`}
                  className="d-flex align-items-center border p-3 mb-3 rounded"
                >
                  <img
                    src={`${apiUrl}/api/product/photo-product/${item._id}`}
                    alt={item.name}
                    width={100}
                    height={100}
                    style={{ objectFit: "contain" }}
                    className="me-3"
                  />
                  <div className="flex-grow-1">
                    <h6 className="mb-1">{item.name}</h6>
                    <p className="mb-1 text-muted">{item.description?.substring(0, 50)}...</p>
                    <p className="fw-bold text-danger">₹{item.price}</p>
                    <Button
                      type="link"
                      danger
                      icon={<DeleteOutlined style={{ width: 16, height: 16 }} />}
                      onClick={() => removeFromCart(item._id)}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="col-md-4">
            <div className="border rounded p-3 shadow-sm">
              <h5>Order Summary</h5>
              <hr />
              <p>Total Items: <strong>{cart.length}</strong></p>
              <p>Total Price: <strong className="text-danger">₹{totalPrice()}</strong></p>

              {auth?.user?.Address ? (
                <p className="text-success">
                  Current Address: <strong>{auth.user.Address}</strong>
                  <button
                    className="btn btn-outline-warning mt-3"
                    onClick={() => navigate("/dash/user/profile")}
                  >
                    Update
                  </button>
                </p>
              ) : (
                <Button
                  type="primary"
                  block
                  disabled={cart.length === 0}
                  onClick={handleCheckout}
                  className="mt-3"
                >
                  Please Login to Checkout
                </Button>
              )}

              {cart.length > 0 && (
                <button
                  className="btn btn-primary w-100 mt-2"
                  onClick={handlePayment}
                  disabled={loading}
                >
                  {loading ? "Processing..." : "Make Payment"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layouts>
  );
};

export default CartPages;
