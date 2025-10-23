import React, { useEffect, useState } from "react";
import Layouts from "../components/Layout/Layouts";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const ProductDetails = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
   // Env variable use

  // Fetch single product
  const getProduct = async () => {
    try {
      const { data } = await axios.get(
        `${apiUrl}/api/product/get-product/${params.slug}`
      );
      if (data?.success) {
        setProduct(data.product);
        if (data.product?._id && data.product?.category?._id) {
          getSimilar(data.product._id, data.product.category._id);
        }
      }
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  };

  // Fetch related products
  const getSimilar = async (pid, cid) => {
    try {
      const { data } = await axios.get(
        `${apiUrl}/api/product/related-product/${pid}/${cid}`
      );
      if (data?.success) setRelated(data.products);
    } catch (error) {
      console.error("Error fetching related products:", error);
    }
  };

  useEffect(() => {
    if (params?.slug) getProduct();
  }, [params?.slug]);

  return (
    <Layouts>
      {product && (
        <div className="row bg-white shadow-sm rounded p-4 g-4">
          {/* Product Image */}
          <div className="col-12 col-md-5 d-flex align-items-center justify-content-center border-end">
            <img
              src={`${apiUrl}/api/product/photo-product/${product._id}`}
              alt={product.name}
              className="img-fluid"
              style={{ maxHeight: "450px", objectFit: "contain" }}
            />
          </div>

          {/* Product Details */}
          <div className="col-12 col-md-7">
            <h2 className="fw-bold">{product.name}</h2>
            <p className="text-muted">{product.description}</p>

            {/* Price & Rating */}
            <div className="d-flex align-items-center mb-3">
              <h3 className="text-danger fw-bold me-3">₹{product.price}</h3>
              <div className="d-flex align-items-center">
                <span className="text-warning me-1">★ ★ ★ ★ ☆</span>
                <small className="text-muted">(120 reviews)</small>
              </div>
            </div>

            {/* Stock & Category */}
            <p className="mb-1">
              <strong>Quantity:</strong>{" "}
              {product.quantity > 0 ? (
                <span className="text-success">
                  In Stock ({product.quantity})
                </span>
              ) : (
                <span className="text-danger">Out of Stock</span>
              )}
            </p>
            <p className="mb-3">
              <strong>Category:</strong> {product.category?.name}
            </p>

            {/* Buttons */}
            <div className="d-flex gap-2 flex-wrap">
              <button className="btn btn-warning fw-bold px-4 py-2 flex-grow-1">
                🛒 Add to Cart
              </button>
              <button className="btn btn-danger fw-bold px-4 py-2 flex-grow-1">
                🔥 Buy Now
              </button>
              <button className="btn btn-outline-secondary fw-bold px-4 py-2 flex-grow-1">
                ❤️ Wishlist
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Similar Products */}
      <div className="mt-5">
        <h4 className="mb-4">Similar Products</h4>
        <div className="row">
          {related.length < 1 && (
            <p className="text-muted text-center">No similar products found</p>
          )}
          {related.map((p) => (
            <div
              className="col-6 col-sm-6 col-md-4 col-lg-3 mb-4"
              key={p._id}
            >
              <div
                className="card border-0 shadow-sm rounded h-100 hover-shadow"
                style={{ transition: "transform 0.2s" }}
                onClick={() => navigate(`/product/${p.slug}`)}
              >
                {/* Product Image */}
                <div
                  className="d-flex align-items-center justify-content-center p-3"
                  style={{ height: "200px" }}
                >
                  <img
                    src={`${apiUrl}/api/product/photo-product/${p._id}`}
                    alt={p.name}
                    className="img-fluid"
                    style={{ maxHeight: "180px", objectFit: "contain" }}
                  />
                </div>

                {/* Card Body */}
                <div className="card-body p-3 d-flex flex-column">
                  <h6 className="fw-bold text-truncate mb-2">{p.name}</h6>
                  <p className="card-text text-danger fw-bold mb-2">
                    ₹{p.price}
                  </p>
                  <p className="small mb-1">
                    <strong>Qty:</strong>{" "}
                    {p.quantity > 0 ? (
                      <span className="text-success">In Stock</span>
                    ) : (
                      <span className="text-danger">Out of Stock</span>
                    )}
                  </p>
                  <p className="small text-muted mb-3">
                    <strong>Category:</strong> {p.category?.name}
                  </p>

                  <button className="btn btn-sm btn-warning fw-bold mt-auto">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layouts>
  );
};

export default ProductDetails;
