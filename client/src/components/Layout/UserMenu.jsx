import React from "react";
import { NavLink } from "react-router-dom";

const UserMenu = () => {
  return (
    <div className="mb-4">
      <div className="card shadow-sm border-0">
        <div className="card-header bg-white border-bottom">
          <h5 className="mb-0 text-dark">Your Account</h5>
        </div>
        <div className="list-group list-group-flush">
          <NavLink
            to="/dash/user/profile"
            className={({ isActive }) =>
              `list-group-item list-group-item-action ${
                isActive ? "active fw-bold" : ""
              }`
            }
          >
            👤 Profile
          </NavLink>
          <NavLink
            to="/dash/user/order"
            className={({ isActive }) =>
              `list-group-item list-group-item-action ${
                isActive ? "active fw-bold" : ""
              }`
            }
          >
            📦 Orders
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default UserMenu;
