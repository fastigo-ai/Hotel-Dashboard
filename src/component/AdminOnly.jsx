// src/components/AdminOnly.jsx
import React from "react";
import { getCurrentUser } from "../utils/auth";

export default function AdminOnly({ children }) {
  const user = getCurrentUser();
  if (!user || user.role !== "admin") {
    return (
      <div className="p-6 bg-red-50 rounded">
        <p className="text-red-700 font-medium">Access denied. Admins only.</p>
      </div>
    );
  }
  return <>{children}</>;
}
