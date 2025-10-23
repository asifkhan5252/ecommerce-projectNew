import React, { useState } from "react";
import "./Register.css";
import Layouts from "../../components/Layout/Layouts";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    Address: "",
    phone: "",
    answer: "",
  });

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${apiUrl}/api/auth/register`, formData);

      if (response?.data?.success) {
        toast.success(response.data.message);

        // Clear form
        setFormData({
          name: "",
          email: "",
          password: "",
          Address: "",
          phone: "",
          answer: "",
        });

        navigate("/login");
      } else {
        toast.error(response?.data?.message || "Registration failed");
      }
    } catch (error) {
      console.error("Registration Error:", error);
      toast.error("Something went wrong");
    }
  };

  return (
    <Layouts>
      <div className="form-container">
        <h2>Register</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

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
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Address</label>
            <input
              type="text"
              name="Address"
              placeholder="Enter your address"
              value={formData.Address}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="text"
              name="phone"
              placeholder="Enter your phone"
              value={formData.phone}
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
            Register
          </button>
        </form>
      </div>
    </Layouts>
  );
};

export default Register;
