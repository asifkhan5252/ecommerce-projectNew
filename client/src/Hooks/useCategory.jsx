import { useState, useEffect } from "react";
import axios from "axios";

const useCategory = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ Use environment variable
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const getCategories = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${apiUrl}/api/category/get-category`);
      if (data?.success) {
        setCategories(data.categories);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  return { categories, loading };
};

export default useCategory;
