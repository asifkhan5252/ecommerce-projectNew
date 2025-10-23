import React, { useEffect, useState } from "react";
import Layouts from "../../components/Layout/Layouts";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../../Context/Auth";
// import AdminMenu from "../../components/Layout/AdminMenu"; // better for admin orders
import UserMenu from "../../components/Layout/UserMenu";
const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [auth] = useAuth();

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // ✅ Fetch all orders
  const getAllOrders = async () => {
    try {
      const { data } = await axios.get(`${apiUrl}/api/auth/all-orders`, {
        headers: { Authorization: auth?.token },
      });

      if (data?.success) {
        setOrders(data.orders);
      } else {
        toast.error("Failed to fetch orders");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Error fetching orders");
    }
  };

  useEffect(() => {
    if (auth?.token) getAllOrders();
  }, [auth?.token]);

  return (
    <Layouts title={"All Orders - Admin Dashboard"}>
      <div className="container mx-auto px-4 py-8">
        <div className="row">
          {/* Sidebar */}
          <div className="col-12 col-md-3 mb-4">
            <UserMenu />
          </div>

          {/* Orders Table */}
          <div className="col-12 col-md-9">
            <div className="card shadow p-4 rounded-3xl">
              <h2 className="text-2xl font-bold mb-4 border-b pb-2">
                All Orders ({orders.length})
              </h2>

              {orders.length === 0 ? (
                <p className="text-gray-500">No orders found.</p>
              ) : (
                orders.map((order) => (
                  <div key={order._id} className="border rounded-lg p-3 mb-4 bg-light">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <p className="mb-0">
                        <strong>Order ID:</strong> {order._id}
                      </p>
                      <span
                        className={`badge ${
                          order.status === "Paid"
                            ? "bg-success"
                            : "bg-warning text-dark"
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>

                    <p>
                      <strong>Buyer:</strong> {order.buyer?.name || "N/A"} (
                      {order.buyer?.email || "N/A"})
                    </p>
                    <p>
                      <strong>Total:</strong> ₹{order.totalAmount || 0}
                    </p>
                    <p>
                      <strong>Date:</strong>{" "}
                      {order.createdAt ? new Date(order.createdAt).toLocaleString() : "N/A"}
                    </p>

                    {/* 🛒 Products List */}
                    <div className="mt-3">
                      <h6 className="fw-semibold">Products:</h6>
                      {order.cart?.map((p) => (
                        <div
                          key={p._id}
                          className="d-flex align-items-center border rounded p-2 mb-2"
                        >
                          <img
                            src={`${apiUrl}/api/product/photo-product/${p._id}`}
                            alt={p.name}
                            className="me-3 rounded"
                            style={{ width: "60px", height: "60px", objectFit: "contain" }}
                          />
                          <div>
                            <p className="mb-0 fw-bold">{p.name}</p>
                            <p className="mb-0">{p.description?.substring(0, 50)}...</p>
                            <p className="mb-0 fw-bold text-muted">
                              ₹{p.price} × quantity {p.quantity || 1}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </Layouts>
  );
};

export default AdminOrders;
