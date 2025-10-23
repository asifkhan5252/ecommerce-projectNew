import React, { useState, useEffect } from "react";
import Layouts from "../components/Layout/Layouts";
import axios from "axios";
import { Button, Checkbox, Radio, Spin } from "antd";
import { prices } from "../components/Prices";
import { useNavigate } from "react-router-dom";
import { useCart } from "../Context/Cart";
import toast from "react-hot-toast";

const Homepage = () => {
  const [cart, setCart] = useCart();
  const [Products, setProducts] = useState([]);
  const [Categories, setCategories] = useState([]);
  const [checked, setChecked] = useState([]);
  const [radio, setRadio] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // ✅ Use environment variable (Vite)
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // ✅ Fetch categories
  const getAllCategories = async () => {
    try {
      const { data } = await axios.get(`${apiUrl}/api/category/get-category`);
      if (data?.success) setCategories(data.categories);
    } catch (error) {
      console.error(error);
    }
  };

  // ✅ Get all products (first page)
  const getAllProduct = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${apiUrl}/api/product/product-list/${page}`);
      if (data?.success) setProducts(data.products);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Load More (append products)
  const loadmore = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${apiUrl}/api/product/product-list/${page}`);
      if (data?.success) {
        setProducts([...Products, ...data.products]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Get total product count
  const getTotal = async () => {
    try {
      const { data } = await axios.get(`${apiUrl}/api/product/product-count`);
      if (data?.success) setTotal(data.total);
    } catch (error) {
      console.error(error);
    }
  };

  // ✅ First load
  useEffect(() => {
    getAllCategories();
    getTotal();
    getAllProduct();
  }, []);

  // ✅ Load more on page change
  useEffect(() => {
    if (page === 1) return;
    loadmore();
  }, [page]);

  // ✅ Filter products
  const filterProduct = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post(`${apiUrl}/api/product/filter-product`, {
        checked,
        radio,
      });
      setProducts(data?.products);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Watch filters
  useEffect(() => {
    if (!checked.length && !radio.length) {
      getAllProduct();
    } else {
      filterProduct();
    }
  }, [checked, radio]);

  // ✅ Handle category filter
  const handleFilter = (value, id) => {
    let all = [...checked];
    if (value) all.push(id);
    else all = all.filter((c) => c !== id);
    setChecked(all);
  };

  return (
    <Layouts title={"ALL product-best offers-home page"}>
      {/* ✅ Auto Sliding Banner */}
      <div id="mainCarousel" className="carousel slide mb-4" data-bs-ride="carousel" data-bs-interval="3000">
        <div className="carousel-inner">
          <div className="carousel-item active">
            <img
              src="https://i.pinimg.com/736x/d6/20/cf/d620cf73dfc1456a52a9d55578e3da4c.jpg"
              className="d-block w-100"
              alt="Fashion Sale Banner"
              style={{ maxHeight: "300px", objectFit: "cover" }}
            />
            <div className="carousel-caption d-none d-md-block">
              <h3 className="fw-bold text-light">🛍️ Fashion Fiesta</h3>
              <p>Trendy outfits with flat 50% off!</p>
            </div>
          </div>

          <div className="carousel-item">
            <img
              src="https://cdn.pixabay.com/photo/2018/08/29/17/07/ecommerce-3640321_1280.jpg"
              className="d-block w-100"
              alt="Men Fashion Brand"
              style={{ maxHeight: "300px", objectFit: "cover" }}
            />
            <div className="carousel-caption d-none d-md-block">
              <h3 className="fw-bold text-light">⚡Men Fashion Brand</h3>
              <p>Up to 70% off on Jeans and Shirt!</p>
            </div>
          </div>

          <div className="carousel-item">
            <img
              src="https://m.media-amazon.com/images/I/81hIlE5xocL._SX3000_.jpg"
              className="d-block w-100"
              alt="Home Decor Banner"
              style={{ maxHeight: "300px", objectFit: "cover" }}
            />
            <div className="carousel-caption d-none d-md-block">
              <h3 className="fw-bold text-light">🏡 Home Decor Sale</h3>
              <p>Decorate your dream home with amazing discounts</p>
            </div>
          </div>
        </div>

        <button className="carousel-control-prev" type="button" data-bs-target="#mainCarousel" data-bs-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#mainCarousel" data-bs-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>

      <div className="row">
        {/* 🧭 Filter Sidebar */}
        <div className="col-12 col-md-3 mb-3">
          <div className="filter-section p-3 shadow-sm rounded bg-white">
            <button
              className="btn btn-outline-primary w-100 d-md-none mb-3 fw-semibold"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#filterCollapse"
            >
              🧭 Filter & Sort
            </button>

            <div className="collapse d-md-block" id="filterCollapse">
              <h5 className="text-primary fw-bold border-bottom pb-2 mb-3">Category</h5>
              {Categories?.map((c) => (
                <div key={c._id} className="py-1 px-2">
                  <Checkbox onChange={(e) => handleFilter(e.target.checked, c._id)}>{c.name}</Checkbox>
                </div>
              ))}

              <h5 className="text-primary fw-bold border-bottom pb-2 mb-3">Price Range</h5>
              <Radio.Group onChange={(e) => setRadio(e.target.value)}>
                {prices?.map((p) => (
                  <div key={p._id} className="py-1 px-2">
                    <Radio value={p.array}>{p.name}</Radio>
                  </div>
                ))}
              </Radio.Group>

              <div className="d-flex justify-content-center mt-3">
                <Button onClick={() => window.location.reload()}>Reset All Filters</Button>
              </div>
            </div>
          </div>
        </div>

        {/* 🛒 Product Grid */}
        <div className="col-md-9">
          <h1 className="text-center">All Products</h1>
          {loading && Products.length === 0 ? (
            <div className="d-flex justify-content-center align-items-center" style={{ height: "50vh" }}>
              <Spin size="large" />
            </div>
          ) : (
            <>
              <div className="row">
                {Products.map((p) => (
                  <div className="col-6 col-sm-6 col-md-4 col-lg-2 mb-4" key={p._id}>
                    <div className="card h-100 shadow-sm border-0 hover-card">
                      <img
                        src={`${apiUrl}/api/product/photo-product/${p._id}`}
                        className="card-img-top"
                        alt={p.name}
                        style={{
                          height: "180px",
                          objectFit: "cover",
                          borderTopLeftRadius: "0.5rem",
                          borderTopRightRadius: "0.5rem",
                        }}
                      />
                      <div className="card-body d-flex flex-column">
                        <h6 className="fw-bold text-truncate">{p.name}</h6>
                        <p className="small text-muted">{p.description?.substring(0, 30)}...</p>
                        <div className="mt-auto">
                          <p className="fw-bold mb-1">₹{p.price}</p>
                          <p>
                            <small className="text-muted">Qty: {p.quantity}</small>
                          </p>
                          <button className="btn btn-primary mb-2" onClick={() => navigate(`/product-detail/${p.slug}`)}>
                            All Details
                          </button>
                          <button
                            onClick={() => {
                              setCart([...cart, p]);
                              toast.success("Added to cart successfully!");
                            }}
                            className="btn btn-secondary"
                          >
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="d-flex justify-content-center mb-2">
                {Products.length < total && (
                  <Button type="primary" loading={loading} onClick={() => setPage(page + 1)}>
                    {loading ? "Loading..." : "Load More Product"}
                  </Button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </Layouts>
  );
};

export default Homepage;
