import React from "react";
import { Navigate } from "react-router-dom";
import { isLoggedIn } from "../helpers/authHelper";

const PrivateRouteAdmin = ({ children }) => {
  return isLoggedIn() ? children : <Navigate to="/admin/login" />;
};

export default PrivateRouteAdmin;
