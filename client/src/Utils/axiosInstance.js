
import axios from "axios";

// ✅ Base URL from environment (Vite-style)
const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

// ✅ Axios instance
const axiosInstance = axios.create({
  baseURL: apiUrl,
  withCredentials: true, // optional: agar cookies ya auth use karte ho
});

// ✅ Interceptors (optional - for future auth / errors)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default axiosInstance;
