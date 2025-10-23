import React, { useState, useEffect } from "react";
import Layouts from "../../components/Layout/Layouts";
import AdminMenu from "../../components/Layout/AdminMenu";
import axios from "axios";
import toast from "react-hot-toast";
import { Select } from "antd";
import { useNavigate, useParams } from "react-router-dom";
const { Option } = Select;

const UpdateProduct = () => {
  const params = useParams();
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
  const [productId, setProductId] = useState("");

  // ✅ Backend URL
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // ✅ Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Fetch single product
  const getSingleProduct = async () => {
    try {
      const { data } = await axios.get(
        `${apiUrl}/api/product/get-product/${params.slug}`
      );
      if (data?.success) {
        setFormData({
          name: data.product.name || "",
          slug: data.product.slug || "",
          description: data.product.description || "",
          price: data.product.price || "",
          category: data.product.category?._id || "",
          quantity: data.product.quantity || "",
          shipping: data.product.shipping ? "true" : "false",
        });
        setProductId(data.product._id);
      }
    } catch (error) {
      console.error(error);
      toast.error("Error while getting single product");
    }
  };

  useEffect(() => {
    getSingleProduct();
    // eslint-disable-next-line
  }, []);

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

  // ✅ Update Product
  const updateProductAll = async (e) => {
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
      photo && productData.append("photo", photo);

      const { data } = await axios.put(
        `${apiUrl}/api/product/update-product/${productId}`,
        productData,
        {
          headers: {
            Authorization: `Bearer ${authData?.token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (data?.success) {
        toast.success("Product updated successfully");
        navigate("/dash/admin/allproducts");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while updating product");
    }
  };

  // ✅ Delete Product
  const handleDelete = async () => {
    try {
      const authData = JSON.parse(localStorage.getItem("auth"));
      if (!window.confirm("Are you sure you want to delete this product?")) {
        return;
      }

      const { data } = await axios.delete(
        `${apiUrl}/api/product/delete-product/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${authData?.token}`,
          },
        }
      );

      if (data?.success) {
        toast.success("Product deleted successfully");
        navigate("/dash/admin/allproducts");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while deleting product");
    }
  };

  return (
    <Layouts title={"admin-product"}>
      <div className="container-fluid py-3">
        <div className="row">
          {/* Sidebar */}
          <div className="col-12 col-md-3 mb-3">
            <AdminMenu />
          </div>

          {/* Form Section */}
          <div className="col-12 col-md-9">
            <h2 className="mb-4">Update Product</h2>

            <div className="m-1 mx-auto w-100 w-md-75">
              <form onSubmit={updateProductAll}>
                {/* Category Select */}
                <Select
                  variant="borderless"
                  placeholder="Select category"
                  className="form-select mb-3"
                  size="large"
                  value={formData.category || undefined}
                  onChange={(value) =>
                    setFormData({ ...formData, category: value })
                  }
                  showSearch
                  style={{ width: "100%" }}
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

                {/* Show Preview */}
                <div className="text-center mb-3">
                  <img
                    src={
                      photo
                        ? URL.createObjectURL(photo)
                        : `${apiUrl}/api/product/photo-product/${productId}`
                    }
                    alt="product"
                    className="img-fluid rounded"
                    style={{ maxHeight: "250px" }}
                  />
                </div>

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
                  rows={3}
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
                  value={formData.shipping || undefined}
                  onChange={(value) =>
                    setFormData({ ...formData, shipping: value })
                  }
                  className="form-select mb-3"
                  style={{ width: "100%" }}
                >
                  <Option value="false">No</Option>
                  <Option value="true">Yes</Option>
                </Select>

                {/* Buttons */}
                <div className="d-flex flex-wrap gap-2">
                  <button type="submit" className="btn btn-success">
                    Update Product
                  </button>
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="btn btn-danger"
                  >
                    Delete Product
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layouts>
  );
};

export default UpdateProduct;
