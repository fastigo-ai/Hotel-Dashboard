import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { getCurrentUser } from "../utils/auth";
import Dashboard from "../pages/Dashboard";

export default function ProtectedRoute({
  element,
  requireAdmin = false,
  loginPath = "/admin/login", // admin login path
}) {
  const user = getCurrentUser();
  const location = useLocation();

  if (!user) {
    return (
      <Navigate to={loginPath} replace state={{ from: location }} />
    );
  }

  if (requireAdmin && user.role !== "admin") {
    return (
      <Dashboard/>
    );
  }

  return element;
}
