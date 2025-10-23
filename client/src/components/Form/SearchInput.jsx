import React from "react";
import { useSearch } from "../../Context/Search";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SearchInput = () => {
  const [value, setValue] = useSearch();
  const navigate = useNavigate();

  // ✅ Use environment variable for backend URL
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.get(`${apiUrl}/api/product/search/${value.keyword}`);
      setValue({ keyword: "", result: data, lastKeyword: value.keyword });
      navigate("/search");
    } catch (error) {
      console.error("Search Error:", error);
    }
  };

  return (
    <div className="search-wrapper w-100 position-relative d-flex justify-content-center">
      <form
        className="d-flex w-100 flex-column flex-md-row align-items-center"
        onSubmit={handleSubmit}
        style={{ maxWidth: "500px" }}
      >
        <input
          type="search"
          className="form-control me-md-2 mb-2 mb-md-0 shadow-sm"
          value={value.keyword || ""}
          onChange={(e) => setValue({ ...value, keyword: e.target.value })}
          placeholder="Search product.."
          aria-label="Search"
          style={{
            borderRadius: "4px",
            border: "1px solid #ccc",
            padding: "7px 70px",
            fontSize: "14px",
          }}
        />
        <button
          type="submit"
          className="btn shadow-sm"
          style={{
            borderRadius: "4px",
            fontWeight: "600",
            padding: "9px 10px",
            whiteSpace: "nowrap",
          }}
        >
          🔍 Search
        </button>
      </form>
    </div>
  );
};

export default SearchInput;
