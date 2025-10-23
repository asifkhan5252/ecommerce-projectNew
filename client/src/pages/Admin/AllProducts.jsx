import React, { useEffect, useState } from "react";
import Layouts from "../../components/Layout/Layouts";
import AdminMenu from "../../components/Layout/AdminMenu";
import axios from "axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const AllProducts = () => {
  const [Products, setProducts] = useState([]);

  // ✅ Backend URL from env
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // ✅ Fetch all products
  const getProduct = async () => {
    try {
      const { data } = await axios.get(`${apiUrl}/api/product/get-product`);
      if (data?.success) setProducts(data.products);
    } catch (error) {
      console.error(error);
      toast.error("Error while getting products");
    }
  };

  useEffect(() => {
    getProduct();
  }, []);

  return (
    <Layouts title={"admin-products"}>
      <div className="container-fluid my-3 px-3">
        <div className="row">
          {/* Sidebar */}
          <div className="col-12 col-md-3 mb-3">
            <AdminMenu />
          </div>

          {/* Products */}
          <div className="col-12 col-md-9">
            <h2 className="mb-4">All Products</h2>

            <div className="row row-cols-2 row-cols-md-3 row-cols-lg-4 g-3">
              {Array.isArray(Products) &&
                Products.map((p) => (
                  <div className="col" key={p._id}>
                    <Link
                      to={`/dash/admin/allproducts/${p.slug}`}
                      className="text-decoration-none text-dark"
                    >
                      <div className="card h-100 shadow-sm border-0 hover-card">
                        <img
                          src={`${apiUrl}/api/product/photo-product/${p._id}`}
                          className="card-img-top"
                          alt={p.name}
                          style={{
                            height: "200px",
                            objectFit: "cover",
                            borderTopLeftRadius: "0.5rem",
                            borderTopRightRadius: "0.5rem",
                          }}
                        />
                        <div className="card-body d-flex flex-column">
                          <h6 className="card-title fw-bold text-truncate">{p.name}</h6>
                          <p className="card-text small text-muted">{p.description?.substring(0, 50)}...</p>
                          <div className="mt-auto">
                            <p className="card-text fw-bold mb-1">₹{p.price}</p>
                            <p className="card-text">
                              <small className="text-muted">Qty: {p.quantity}</small>
                            </p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* ✅ Custom CSS for hover */}
      <style>{`
        .hover-card {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .hover-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 6px 15px rgba(0,0,0,0.15);
        }
      `}</style>
    </Layouts>
  );
};

export default AllProducts;
