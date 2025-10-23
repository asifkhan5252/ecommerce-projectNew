import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Layouts from "../components/Layout/Layouts";

const CategoryWiseProduct = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState({});
  const [loading, setLoading] = useState(false);

  // ✅ Backend URL
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // Fetch category-wise products
  const getProductsByCategory = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${apiUrl}/api/product/product-category/${params.slug}`
      );
      if (data?.success) {
        setProducts(data.products);
        setCategory(data.category);
      }
    } catch (error) {
      console.error("Error fetching category products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params?.slug) getProductsByCategory();
  }, [params.slug]);

  return (
    <Layouts>
      <div className="container py-4">
        <h2 className="fw-bold text-center mb-3">
          Category - {category?.name || "Category"}
        </h2>
        <p className="text-center text-muted">
          {products.length} product(s) found in this category
        </p>

        {loading ? (
          <p className="text-center text-muted">Loading...</p>
        ) : (
          <div className="row g-4">
            {products.map((p) => (
              <div className="col-6 col-sm-6 col-md-4 col-lg-3" key={p._id}>
                <div className="card h-100 shadow-sm border-0 rounded">
                  <img
                    src={`${apiUrl}/api/product/photo-product/${p._id}`}
                    className="card-img-top"
                    alt={p.name}
                    style={{ height: "200px", objectFit: "contain" }}
                  />
                  <div className="card-body d-flex flex-column">
                    <h6 className="fw-bold text-truncate">{p.name}</h6>
                    <p className="text-danger fw-bold">₹{p.price}</p>
                    <p className="text-muted small">
                      {p.description?.substring(0, 40)}...
                    </p>
                    <button
                      className="btn btn-primary mb-2"
                      onClick={() => navigate(`/product-detail/${p.slug}`)}
                    >
                      All Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layouts>
  );
};

export default CategoryWiseProduct;
