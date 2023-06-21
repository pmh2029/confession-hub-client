import React from "react";
import { Navigate } from "react-router-dom";
import { isLoggedIn } from "../helpers/authHelper";

const PrivateRouteAdmin = ({ children }) => {
  const admin = isLoggedIn();
  return admin.isAdmin ? children : <Navigate to="/admin/login" />;
};

export default PrivateRouteAdmin;
