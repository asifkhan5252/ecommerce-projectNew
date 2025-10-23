import React, { useState } from "react";
import "./Register.css";
import Layouts from "../../components/Layout/Layouts";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ForgetPassword = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    newPassword: "",
    answer: "",
  });

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${apiUrl}/api/auth/forget-password`, formData);

      if (response?.data?.success) {
        toast.success(response.data.message);
        setFormData({ email: "", newPassword: "", answer: "" });
        navigate("/login");
      } else {
        toast.error(response?.data?.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Forget Password Error:", error);
      toast.error("Something went wrong");
    }
  };

  return (
    <Layouts>
      <div className="form-container">
        <h2>Reset Password</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>New Password</label>
            <input
              type="password"
              name="newPassword"
              placeholder="Enter your new password"
              value={formData.newPassword}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Security Answer</label>
            <input
              type="text"
              name="answer"
              placeholder="Enter your favorite food"
              value={formData.answer}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Reset
          </button>
        </form>
      </div>
    </Layouts>
  );
};

export default ForgetPassword;
