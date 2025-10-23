import React from "react";
import Layouts from "../../components/Layout/Layouts";
import { useAuth } from "../../Context/Auth";
import UserMenu from "../../components/Layout/UserMenu";

const Dashboard = () => {
  const [auth] = useAuth();

  return (
    <Layouts title={"User Dashboard"}>
      <div className="container py-4">
        <div className="row">
          {/* Sidebar */}
          <div className="col-md-3 mb-4">
            <UserMenu />
          </div>

          {/* Dashboard Content */}
          <div className="col-md-9">
            <div className="card shadow-sm border-0 mb-4">
              <div className="card-body">
                <h4 className="card-title mb-3">Hello, {auth?.user?.name}</h4>
                <p className="text-muted">
                  Welcome to your Amazon-style dashboard. Manage your profile,
                  view orders, and update your account.
                </p>
              </div>
            </div>

            {/* Account Info Section */}
            <div className="card shadow-sm border-0">
              <div className="card-body">
                <h5 className="card-title border-bottom pb-2 mb-3">
                  Your Account Details
                </h5>
                <div className="row mb-3">
                  <div className="col-sm-4 text-muted">Full Name</div>
                  <div className="col-sm-8">{auth?.user?.name}</div>
                </div>
                <div className="row mb-3">
                  <div className="col-sm-4 text-muted">Email</div>
                  <div className="col-sm-8">{auth?.user?.email}</div>
                </div>
                <div className="row mb-3">
                  <div className="col-sm-4 text-muted">Phone</div>
                  <div className="col-sm-8">{auth?.user?.phone || "N/A"}</div>
                </div>
                <div className="row">
                  <div className="col-sm-4 text-muted">Address</div>
                  <div className="col-sm-8">
                    {auth?.user?.Address || "No address added"}
                  </div>
                </div>
              </div>
            </div>

            {/* Example Orders Section */}
            <div className="card shadow-sm border-0 mt-4">
              <div className="card-body">
                <h5 className="card-title border-bottom pb-2 mb-3">
                  Your Orders
                </h5>
                <p className="text-muted">
                  You haven’t placed any orders yet.{" "}
                  <a href="/" className="text-decoration-none">
                    Start shopping
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layouts>
  );
};

export default Dashboard;
