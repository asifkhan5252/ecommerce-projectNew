import React, { useEffect, useState } from "react";
import UserMenu from "../../components/Layout/UserMenu";
import Layouts from "../../components/Layout/Layouts";
import toast from "react-hot-toast";
import axios from "axios";
import { useAuth } from "../../Context/Auth";

const Profile = () => {
  const [loading, setLoading] = useState(false);
  const [auth, setAuth] = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    Address: "",
    phone: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Pre-fill user details
  useEffect(() => {
    if (auth?.user) {
      setFormData({
        name: auth.user.name || "",
        email: auth.user.email || "",
        phone: auth.user.phone || "",
        Address: auth.user.Address || "",
        password: "",
      });
    }
  }, [auth]);

   const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
  // Update profile
  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  try {
    const { data } = await axios.put(`${apiUrl}/api/auth/profile`, formData, {
      headers: { Authorization: auth?.token },
    });
    if (data?.success) {
      toast.success("Profile updated successfully ✅");
      setAuth({ ...auth, user: data.updatedUser });
      localStorage.setItem("auth", JSON.stringify({ ...auth, user: data.updatedUser }));
    } else {
      toast.error(data.message);
    }
  } catch (error) {
    console.error("Profile Update Error:", error);
    toast.error("Something went wrong ❌");
  } finally {
    setLoading(false);
  }
};

  return (
    <Layouts title={"User Profile"}>
      <div className="container py-4">
        <div className="row">
          {/* Sidebar */}
          <div className="col-md-3 mb-4">
            <UserMenu />
          </div>

          {/* Profile Form */}
          <div className="col-md-9">
            <div className="card shadow-sm border-0">
              <div className="card-body">
                <h4 className="card-title mb-4 border-bottom pb-2">
                  Update Profile
                </h4>

                <form onSubmit={handleSubmit}>
                  {/* Full Name */}
                  <div className="mb-3">
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="Enter your name"
                    />
                  </div>

                  {/* Email */}
                  <div className="mb-3">
                    <label className="form-label">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      className="form-control bg-light"
                      disabled
                    />
                  </div>

                  {/* Password */}
                  <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="Enter new password"
                    />
                  </div>

                  {/* Address */}
                  <div className="mb-3">
                    <label className="form-label">Address</label>
                    <input
                      type="text"
                      name="Address"
                      value={formData.Address}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="Enter your address"
                    />
                  </div>

                  {/* Phone */}
                  <div className="mb-3">
                    <label className="form-label">Phone Number</label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="Enter your phone number"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="d-grid">
                   <button type="submit" className="btn btn-warning btn-lg" disabled={loading}>
  {loading ? "Saving..." : "Save Changes"}
</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layouts>
  );
};

export default Profile;
