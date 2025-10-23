import React from "react";
import Layouts from "../components/Layout/Layouts";
import useCategory from "../Hooks/useCategory"; // dhyan do path sahi ho

import { Link } from "react-router-dom";

const Categories = () => {
  const { categories, loading } = useCategory();

  return (
    <Layouts>
      <div className="container py-4">
        <h2 className="mb-4 text-center fw-bold">All Categories</h2>

        {loading ? (
          <p className="text-center text-muted">Loading categories...</p>
        ) : (
          <div className="row g-4">
            {categories?.map((c) => (
              <div key={c._id} className="col-6 col-sm-4 col-md-3 col-lg-2">
                <Link
                  to={`/category/${c.slug}`}
                  className="text-decoration-none"
                >
                  <div className="card shadow-sm border-0 text-center h-100 p-3 hover-card">
                    <h6 className="fw-bold text-dark">{c.name}</h6>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layouts>
  );
};

export default Categories;
