import React, { useState, useEffect } from "react";
import Layouts from "../../components/Layout/Layouts";
import AdminMenu from "../../components/Layout/AdminMenu";
import axios from "axios";
import toast from "react-hot-toast";
import { Select } from "antd";
import { useNavigate } from "react-router-dom";
const { Option } = Select;

const Product = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    price: "",
    category: "",
    quantity: "",
    shipping: "",
  });
  const [photo, setPhoto] = useState(null);

  // ✅ Backend URL
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // ✅ Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Fetch categories
  const getCategories = async () => {
    try {
      const { data } = await axios.get(`${apiUrl}/api/category/get-category`);
      if (data?.success) {
        setCategories(data.categories);
      }
    } catch (error) {
      console.error(error);
      toast.error("Error while getting categories");
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  // ✅ handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const authData = JSON.parse(localStorage.getItem("auth"));

      const productData = new FormData();
      productData.append("name", formData.name);
      productData.append("description", formData.description);
      productData.append("price", formData.price);
      productData.append("category", formData.category);
      productData.append("quantity", formData.quantity);
      productData.append("shipping", formData.shipping);
      if (photo) productData.append("photo", photo);

      const { data } = await axios.post(
        `${apiUrl}/api/product/create-product`,
        productData,
        {
          headers: {
            Authorization: `Bearer ${authData?.token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (data?.success) {
        toast.success("Product created successfully");
        setFormData({
          name: "",
          description: "",
          price: "",
          category: "",
          quantity: "",
          shipping: "",
        });
        setPhoto(null);
        navigate("/dash/admin/allproducts");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while creating product");
    }
  };

  return (
    <Layouts title={"admin-product"}>
      <div className="container-fluid my-3 px-3">
        <div className="row">
          {/* Sidebar */}
          <div className="col-12 col-md-3 mb-3">
            <AdminMenu />
          </div>

          {/* Main Form */}
          <div className="col-12 col-md-9">
            <h2 className="mb-4">Create Product</h2>

            <div className="card shadow-sm p-4">
              <form onSubmit={handleSubmit}>
                {/* Category Select */}
                <Select
                  placeholder="Select category"
                  variant="borderless"
                  className="form-select mb-3"
                  size="large"
                  value={formData.category || undefined}
                  onChange={(value) =>
                    setFormData({ ...formData, category: value })
                  }
                  style={{ width: "100%" }}
                  showSearch
                >
                  {categories.map((c) => (
                    <Option key={c._id} value={c._id}>
                      {c.name}
                    </Option>
                  ))}
                </Select>

                {/* Upload Photo */}
                <div className="mb-3">
                  <label className="btn btn-outline-primary w-100">
                    {photo ? photo.name : "Upload photo"}
                    <input
                      type="file"
                      name="photo"
                      onChange={(e) => setPhoto(e.target.files[0])}
                      accept="image/*"
                      hidden
                    />
                  </label>
                </div>

                {photo && (
                  <div className="text-center mb-3">
                    <img
                      src={URL.createObjectURL(photo)}
                      alt="product-photo"
                      className="img-fluid rounded"
                      style={{ maxHeight: "200px", objectFit: "cover" }}
                    />
                  </div>
                )}

                {/* Name */}
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  placeholder="Enter name"
                  className="form-control mb-3"
                  onChange={handleChange}
                />

                {/* Description */}
                <textarea
                  name="description"
                  value={formData.description}
                  placeholder="Enter description"
                  className="form-control mb-3"
                  onChange={handleChange}
                />

                {/* Price */}
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  placeholder="Enter price"
                  className="form-control mb-3"
                  onChange={handleChange}
                />

                {/* Quantity */}
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  placeholder="Enter quantity"
                  className="form-control mb-3"
                  onChange={handleChange}
                />

                {/* Shipping */}
                <Select
                  variant="borderless"
                  size="large"
                  placeholder="Select Shipping"
                  value={
                    formData.shipping === "" ? undefined : formData.shipping
                  }
                  onChange={(value) =>
                    setFormData({ ...formData, shipping: value })
                  }
                  className="form-select mb-3"
                  style={{ width: "100%" }}
                >
                  <Option value={false}>No</Option>
                  <Option value={true}>Yes</Option>
                </Select>

                {/* Submit Button */}
                <button type="submit" className="btn btn-success w-100">
                  Create Product
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layouts>
  );
};

export default Product;
