import React, { useState } from "react";
import "./Register.css";
import Layouts from "../../components/Layout/Layouts";
import toast from "react-hot-toast";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/Auth";

const Login = () => {
  const [auth, setAuth] = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${apiUrl}/api/auth/login`, formData);

      if (response?.data?.success) {
        toast.success(response.data.message);

        // Clear form
        setFormData({ email: "", password: "" });

        // Set auth in context
        setAuth({
          ...auth,
          user: response.data.user,
          token: response.data.token,
        });

        // Save minimal info in localStorage
        localStorage.setItem(
          "auth",
          JSON.stringify({
            user: response.data.user,
            token: response.data.token,
          })
        );

        // Redirect after login
        const redirectPath = location.state?.from || "/";
        navigate(redirectPath, { replace: true });
      } else {
        toast.error(response?.data?.message || "Login failed");
      }
    } catch (error) {
      console.error("Login Error:", error);
      toast.error("Something went wrong");
    }
  };

  return (
    <Layouts>
      <div className="form-container">
        <h2>Login</h2>
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

          <button type="submit" className="btn btn-primary w-100">
            Login
          </button>

          <div className="mt-3 text-center">
            <button
              type="button"
              className="btn btn-link"
              onClick={() => navigate("/forget-password")}
            >
              Forget password?
            </button>
          </div>
        </form>
      </div>
    </Layouts>
  );
};

export default Login;
