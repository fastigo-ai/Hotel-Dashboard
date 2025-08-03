// src/component/ui/Navbar.jsx
import React, { useState, useEffect } from "react";
import { FaBars, FaTimes, FaHome } from "react-icons/fa";
import { Routes, Route, Link, useNavigate, Navigate } from "react-router-dom";

import Dashboard from "../../pages/Dashboard";
import Products from "../../pages/Products";
import NewProduct from "../../pages/NewProduct";
import Customers from "../../pages/Customers";
import UpdateNewProduct from "../../pages/productdetail/UpdateNewProduct";
import CreateListingForm from "../../pages/productdetail/Update";
import Login from "../../pages/Login";
import ProtectedRoute from "../ProtectedRoute"; // adjust path if needed
import {
  getCurrentUser,
  logout as authLogout,
  initAuthDemo,
} from "../../utils/auth";

function SidebarContent({ setIsSidebarOpen, onLogout, currentUser }) {
  const menuItems = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Products", path: "/products" },
    { label: "Add New Product", path: "/add-product" },
    { label: "Customers", path: "/customers" },
  ];

  return (
    <div className="p-4">
      <ul className="space-y-8">
        <li className="flex items-center gap-4 text-white font-semibold mb-4">
          <FaHome />
          Admin
        </li>
        {menuItems.map((item, idx) => (
          <li key={idx}>
            <Link
              to={item.path}
              className="text-lg block hover:text-white/80 pl-12"
              onClick={() => setIsSidebarOpen(false)}
            >
              {item.label}
            </Link>
          </li>
        ))}
        {currentUser ? (
          <button
            onClick={() => {
              onLogout();
              setIsSidebarOpen(false);
            }}
            className="flex items-center gap-4 text-white font-semibold mb-4 cursor-pointer pl-12"
          >
            <FaHome />
            Logout
          </button>
        ) : (
          <Link
            to="/admin/login"
            className="flex items-center gap-4 text-white font-semibold mb-4 cursor-pointer pl-12"
            onClick={() => setIsSidebarOpen(false)}
          >
            <FaHome />
            Login
          </Link>
        )}
      </ul>
    </div>
  );
}

export default function NavbarWithSidebar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // initialize demo auth (seeds admin) and load session
    initAuthDemo().then(() => {
      const user = getCurrentUser();
      setCurrentUser(user);
    });
  }, []);

  const handleLogout = () => {
    authLogout();
    setCurrentUser(null);
    navigate("/admin/login", { replace: true });
  };

  return (
    <div className="h-screen bg-gray-100 flex overflow-hidden">
      {/* Sidebar */}
      <div
        className={`fixed md:static top-0 left-0 h-full w-64 bg-purple-700 text-white z-50 transform transition-transform duration-300 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="flex justify-between items-center p-4 border-b border-purple-600">
          <Link
            to="/dashboard"
            className="text-xl font-bold font-serif whitespace-nowrap"
            onClick={() => setIsSidebarOpen(false)}
          >
            Plains Motor
          </Link>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="text-white text-lg md:hidden"
          >
            <FaTimes />
          </button>
        </div>
        <SidebarContent
          setIsSidebarOpen={setIsSidebarOpen}
          onLogout={handleLogout}
          currentUser={currentUser}
        />
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-40 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Area */}
      <div className="flex-1 flex flex-col transition-all duration-300">
        {/* Navbar */}
        <div className="flex items-center justify-between bg-[#f1f3fd] px-4 md:px-6 py-2 shadow-sm">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="text-gray-600 text-xl md:hidden"
            >
              <FaBars />
            </button>
            <button className="bg-blue-100 text-blue-600 hover:text-white cursor-pointer font-medium px-3 py-1 rounded-md hover:bg-blue-600 transition">
              New Task
            </button>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <img
                src="https://i.pravatar.cc/30?img=13"
                alt="Avatar"
                className="w-9 h-9 rounded-full"
              />
              <div className="text-right leading-tight hidden md:flex md:flex-col">
                <p className="text-xs text-gray-500 text-start">
                  {currentUser ? currentUser.role : "Guest"}
                </p>
                <p className="text-sm font-semibold text-gray-800">
                  {currentUser ? currentUser.email : "Plains Motor"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content with routing */}
        <div className="p-4 md:p-6 overflow-auto flex justify-center">
          <div className="w-full max-w-7xl">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/admin/login" element={<Login />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute
                    element={<Dashboard />}
                    requireAdmin={true}
                    loginPath="/admin/login"
                  />
                }
              />
              <Route
                path="/products"
                element={
                  <ProtectedRoute
                    element={<Products />}
                    requireAdmin={false}
                    loginPath="/admin/login"
                  />
                }
              />
              <Route
                path="/add-product"
                element={
                  <ProtectedRoute
                    element={<NewProduct />}
                    requireAdmin={true}
                    loginPath="/admin/login"
                  />
                }
              />
              <Route
                path="/Update-NewProduct/:id?"
                element={
                  <ProtectedRoute
                    element={<UpdateNewProduct />}
                    requireAdmin={true}
                    loginPath="/admin/login"
                  />
                }
              />
              <Route
                path="/customers"
                element={
                  <ProtectedRoute
                    element={<Customers />}
                    requireAdmin={false}
                    loginPath="/admin/login"
                  />
                }
              />
              <Route
                path="/update/:id?"
                element={
                  <ProtectedRoute
                    element={<CreateListingForm />}
                    requireAdmin={true}
                    loginPath="/admin/login"
                  />
                }
              />
              {/* fallback */}
              <Route
                path="*"
                element={<Navigate to="/dashboard" replace />}
              />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
}
