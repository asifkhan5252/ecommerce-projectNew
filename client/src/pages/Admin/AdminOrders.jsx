import { useEffect, useState } from "react";
import Layouts from "../../components/Layout/Layouts";
import AdminMenu from "../../components/Layout/AdminMenu";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../../Context/Auth";
import { Select } from "antd";
const { Option } = Select;

const AdminOrders = () => {
  const [statusList] = useState([
    "Pending",
    "Processing",
    "Shipped",
    "Delivered",
    "Cancelled",
  ]);
  const [orders, setOrders] = useState([]);
  const [auth] = useAuth();

  // ✅ Backend URL from env
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // ✅ Fetch all orders
  const getAllOrders = async () => {
    try {
      const { data } = await axios.get(`${apiUrl}/api/auth/all-orders-admin`, {
        headers: { Authorization: auth?.token },
      });

      if (data.success) {
        setOrders(data.orders);
      } else {
        toast.error("Failed to load orders");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Error fetching orders");
    }
  };

  // ✅ Handle status update
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const { data } = await axios.put(
        `${apiUrl}/api/auth/update-status/${orderId}`,
        { status: newStatus },
        {
          headers: { Authorization: auth?.token },
        }
      );

      if (data.success) {
        toast.success("✅ Order status updated!");
        getAllOrders(); // refresh orders after update
      } else {
        toast.error("Failed to update order status");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Error updating order status");
    }
  };

  useEffect(() => {
    if (auth?.token) getAllOrders();
  }, [auth?.token]);

  // ✅ Status color helper
  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered":
        return "badge bg-success";
      case "Shipped":
        return "badge bg-info text-dark";
      case "Processing":
        return "badge bg-primary";
      case "Cancelled":
        return "badge bg-danger";
      default:
        return "badge bg-secondary";
    }
  };

  return (
    <Layouts title={"All Orders - Admin"}>
      <div className="container-fluid py-4">
        <div className="row">
          {/* Sidebar */}
          <div className="col-md-3 mb-4">
            <AdminMenu />
          </div>

          {/* Orders Section */}
          <div className="col-md-9">
            <h2 className="mb-4 fw-bold border-bottom pb-2">All Orders</h2>

            {orders.length === 0 ? (
              <p className="text-muted">No orders found.</p>
            ) : (
              orders.map((order) => (
                <div key={order._id} className="card shadow-sm mb-4 p-3">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="mb-0">
                      Order ID: <span className="text-secondary">{order._id}</span>
                    </h5>
                    <span className={getStatusColor(order.status)}>
                      {order.status}
                    </span>
                  </div>

                  <p className="mb-1">
                    <strong>Buyer:</strong> {order.buyer?.name || "N/A"} (
                    {order.buyer?.email})
                  </p>
                  <p className="mb-1">
                    <strong>Total:</strong> ₹{order.totalAmount}
                  </p>
                  <p className="mb-1">
                    <strong>Payment:</strong>{" "}
                    <span
                      className={
                        order.status === "Paid"
                          ? "text-success fw-semibold"
                          : "text-warning fw-semibold"
                      }
                    >
                      {order.status || "Unpaid"}
                    </span>
                  </p>
                  <p className="mb-3">
                    <strong>Date:</strong>{" "}
                    {new Date(order.createdAt).toLocaleString()}
                  </p>

                  {/* ✅ Status Dropdown */}
                  <div className="mb-3">
                    <label className="fw-semibold me-2">Update Status:</label>
                    <Select
                      defaultValue={order.status}
                      onChange={(value) => handleStatusChange(order._id, value)}
                      style={{ width: 200 }}
                    >
                      {statusList.map((s, i) => (
                        <Option key={i} value={s}>
                          {s}
                        </Option>
                      ))}
                    </Select>
                  </div>

                  {/* 🛒 Products */}
                  <div>
                    <h6 className="fw-bold mb-2">Products:</h6>
                    {order.cart?.map((p, idx) => (
                      <div
                        key={idx}
                        className="d-flex align-items-center border rounded p-2 mb-2"
                      >
                        <img
                          src={`${apiUrl}/api/product/photo-product/${p._id}`}
                          alt={p.name}
                          className="me-3 rounded"
                          style={{
                            width: "60px",
                            height: "60px",
                            objectFit: "contain",
                          }}
                        />
                        <div>
                          <p className="mb-0 fw-semibold">{p.name}</p>
                          <p className="mb-0 text-muted">
                            ₹{p.price} × {p.quantity}
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
    </Layouts>
  );
};

export default AdminOrders;
