import React, { useEffect, useState } from "react";
import { useAuth } from "../../Context/Auth";
import { Outlet } from "react-router-dom";
import axios from "axios";
import Sppiner from "../Sppiner";

const PrivateRoute = () => {
  const [ok, setOk] = useState(false);
  const [auth] = useAuth();

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    const authCheck = async () => {
      try {
        const res = await axios.get(`${apiUrl}/api/auth/user-auth`, {
          headers: {
            Authorization: auth?.token,
          },
        });

        if (res.data.ok) {
          setOk(true);
        } else {
          setOk(false);
        }
      } catch (error) {
        console.error("User auth check error:", error);
        setOk(false);
      }
    };

    if (auth?.token) authCheck();
  }, [auth?.token, apiUrl]);

  return ok ? <Outlet /> : <Sppiner />;
};

export default PrivateRoute;
