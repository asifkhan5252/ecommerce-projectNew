import React, { useEffect, useState } from "react";
import Layouts from "../../components/Layout/Layouts";
import AdminMenu from "../../components/Layout/AdminMenu";
import toast from "react-hot-toast";
import axios from "axios";
import CategoryForm from "../../components/Form/CategoryFrom";
import { Modal } from "antd";

const CreateCategory = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState(null);
  const [updatedName, setUpdatedName] = useState("");

  // ✅ Backend URL
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // ✅ Fetch categories
  const getCategories = async () => {
    try {
      const { data } = await axios.get(`${apiUrl}/api/category/get-category`);
      if (data?.success) setCategories(data.categories);
    } catch (error) {
      console.error(error);
      toast.error("Error while getting categories");
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  // ✅ Create category
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const authData = JSON.parse(localStorage.getItem("auth"));
      const { data } = await axios.post(
        `${apiUrl}/api/category/create-category`,
        { name },
        { headers: { Authorization: `Bearer ${authData?.token}` } }
      );
      if (data?.success) {
        toast.success(`${name} is created`);
        setName("");
        getCategories();
      } else toast.error(data.message);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong in input form");
    }
  };

  // ✅ Update category
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const authData = JSON.parse(localStorage.getItem("auth"));
      const token = authData?.token;

      const { data } = await axios.put(
        `${apiUrl}/api/category/update-category/${selected._id}`,
        { name: updatedName },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        toast.success(`${updatedName} is updated`);
        setSelected(null);
        setUpdatedName("");
        setVisible(false);
        getCategories();
      } else toast.error(data.message);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  // ✅ Delete category
  const handleDelete = async (id) => {
    try {
      const authData = JSON.parse(localStorage.getItem("auth"));
      const token = authData?.token;

      const { data } = await axios.delete(`${apiUrl}/api/category/delete-category/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        toast.success("Category deleted successfully");
        getCategories();
      } else toast.error(data.message);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while deleting");
    }
  };

  return (
    <Layouts title={"admin-category"}>
      <div className="container-fluid py-3">
        <div className="row">
          <div className="col-12 col-md-3 mb-3">
            <AdminMenu />
          </div>
          <div className="col-12 col-md-9">
            <h2 className="mb-4">Manage Category</h2>

            {/* Category Form */}
            <div className="p-3 border rounded shadow-sm mb-4 w-100 w-md-75">
              <CategoryForm handleSubmit={handleSubmit} value={name} setValue={setName} />
            </div>

            {/* Table */}
            <div className="table-responsive">
              <table className="table table-bordered align-middle text-center">
                <thead className="table-light">
                  <tr>
                    <th>Name</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories?.map((c) => (
                    <tr key={c._id}>
                      <td>{c.name}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-primary mb-2 me-2"
                          onClick={() => {
                            setVisible(true);
                            setUpdatedName(c.name);
                            setSelected(c);
                          }}
                        >
                          Edit
                        </button>
                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete(c._id)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Update Modal */}
            <Modal onCancel={() => setVisible(false)} footer={null} open={visible}>
              <CategoryForm value={updatedName} setValue={setUpdatedName} handleSubmit={handleUpdate} />
            </Modal>
          </div>
        </div>
      </div>
    </Layouts>
  );
};

export default CreateCategory;
