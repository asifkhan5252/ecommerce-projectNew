import React from "react";
import { Link, NavLink } from "react-router-dom";
import { BsHandbagFill } from "react-icons/bs";
import { useAuth } from "../../Context/Auth";
import { Badge } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";
import toast from "react-hot-toast";
import SearchInput from "../Form/SearchInput";
import useCategory from "../../Hooks/useCategory";
import { useCart } from "../../Context/Cart";

const Header = () => {
  const { categories, loading } = useCategory();
  const [cart] = useCart();
  const [auth, setAuth] = useAuth();

  const handllogout = () => {
    setAuth({ ...auth, user: null, token: "" });
    localStorage.removeItem("auth");
    toast.success("Logout Successful");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top">
      <div className="container-fluid">
        {/* Brand */}
        <Link to="/" className="navbar-brand d-flex align-items-center me-3">
          <BsHandbagFill style={{ marginRight: "8px", color: "red" }} />
          E-commerce
        </Link>

        {/* Mobile Toggler */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarResponsive"
          aria-controls="navbarResponsive"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="navbarResponsive">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 align-items-center">
            <li className="nav-item me-3">
              <NavLink to="/" className="nav-link fw-bold">
                Home
              </NavLink>
            </li>

            {/* Categories Dropdown */}
            <li className="nav-item dropdown me-3">
              <Link
                className="nav-link dropdown-toggle"
                to="/categories"
                data-bs-toggle="dropdown"
              >
                Categories
              </Link>
              <ul className="dropdown-menu">
                <li>
                  <Link to="/categories" className="dropdown-item">
                    All Categories
                  </Link>
                </li>
                {loading ? (
                  <li className="dropdown-item">Loading...</li>
                ) : (
                  categories?.map((c) => (
                    <li key={c._id}>
                      <Link to={`/category/${c.slug}`} className="dropdown-item">
                        {c.name}
                      </Link>
                    </li>
                  ))
                )}
              </ul>
            </li>
          </ul>

          {/* Desktop Search - visible on md+ */}
          <div className="d-none d-md-flex flex-grow-1 me-3">
            <SearchInput />
          </div>

          {/* Right Side: Auth & Cart */}
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-center">
            {!auth.user ? (
              <>
                <li className="nav-item me-2">
                  <NavLink to="/register" className="nav-link">
                    Register
                  </NavLink>
                </li>
                <li className="nav-item me-3">
                  <NavLink to="/login" className="nav-link">
                    Login
                  </NavLink>
                </li>
              </>
            ) : (
              <li className="nav-item dropdown me-3">
                <NavLink
                  className="nav-link dropdown-toggle"
                  href="#"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  {auth?.user?.name}
                </NavLink>
                <ul className="dropdown-menu">
                  <li>
                    <NavLink
                      to={`/dash/${auth?.user?.role === 1 ? "admin" : "user"}`}
                      className="dropdown-item"
                    >
                      Dashboard
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/login"
                      onClick={handllogout}
                      className="dropdown-item"
                    >
                      Logout
                    </NavLink>
                  </li>
                </ul>
              </li>
            )}

            {/* Cart Icon */}
            <li className="nav-item">
              <Link to="/cart" className="nav-link position-relative">
                <Badge count={cart.length} size="small" offset={[0, 0]}>
                  <ShoppingCartOutlined
                    style={{ fontSize: "22px", color: "#333" }}
                  />
                </Badge>
              </Link>
            </li>
          </ul>

          {/* Mobile Search - visible on sm */}
          <div className="d-md-none mt-2 w-100">
            <SearchInput />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
