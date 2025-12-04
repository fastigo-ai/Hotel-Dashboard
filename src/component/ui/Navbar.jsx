import React, { useState, useEffect } from "react";
import { FaBars, FaTimes, FaHome, FaBox, FaPlusCircle, FaUsers, FaSignOutAlt, FaTachometerAlt } from "react-icons/fa";
import { Routes, Route, Link, useNavigate, Navigate, useLocation } from "react-router-dom";

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
  const location = useLocation();
  const menuItems = [
    { label: "Dashboard", path: "/dashboard", icon: <FaTachometerAlt /> },
    { label: "Products", path: "/products", icon: <FaBox /> },
    { label: "Add New Product", path: "/add-product", icon: <FaPlusCircle /> },
    { label: "Customers", path: "/customers", icon: <FaUsers /> },
  ];

  return (
    <div className="py-6 px-4">
      <div className="mb-8 px-2">
        <h2 className="text-2xl font-bold text-white tracking-wide flex items-center gap-2">
          <span className="bg-white/20 text-white p-1 rounded-md text-sm"><FaHome /></span> Plains Motor
        </h2>
        <p className="text-xs text-purple-200 mt-1 ml-9">Admin Dashboard</p>
      </div>

      <ul className="space-y-2">
        {menuItems.map((item, idx) => {
          const isActive = location.pathname === item.path;
          return (
            <li key={idx}>
              <Link
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                    ? "bg-white text-purple-700 shadow-lg"
                    : "text-purple-100 hover:bg-purple-600 hover:text-white"
                  }`}
                onClick={() => setIsSidebarOpen(false)}
              >
                <span className={`text-lg ${isActive ? "text-purple-700" : "text-purple-200 group-hover:text-white"}`}>
                  {item.icon}
                </span>
                <span className="font-medium">{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="mt-8 pt-8 border-t border-purple-600">
        {currentUser ? (
          <button
            onClick={() => {
              onLogout();
              setIsSidebarOpen(false);
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-purple-200 hover:bg-purple-600 hover:text-white transition-all duration-200"
          >
            <FaSignOutAlt />
            <span className="font-medium">Logout</span>
          </button>
        ) : (
          <Link
            to="/admin/login"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-purple-200 hover:bg-purple-600 hover:text-white transition-all duration-200"
            onClick={() => setIsSidebarOpen(false)}
          >
            <FaHome />
            <span className="font-medium">Login</span>
          </Link>
        )}
      </div>
    </div>
  );
}

export default function NavbarWithSidebar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // initialize demo auth (seeds admin) and load session
    initAuthDemo().then(() => {
      const user = getCurrentUser();
      setCurrentUser(user);
    });

    const handleAuthChange = () => {
      const user = getCurrentUser();
      setCurrentUser(user);
    };

    window.addEventListener("auth-change", handleAuthChange);
    return () => window.removeEventListener("auth-change", handleAuthChange);
  }, [location]);

  const handleLogout = () => {
    authLogout();
    setCurrentUser(null);
    navigate("/admin/login", { replace: true });
  };

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden font-sans">
      {/* Sidebar - only show if logged in */}
      {currentUser && (
        <div
          className={`fixed md:static top-0 left-0 h-full w-72 bg-purple-700 text-white z-50 transform transition-transform duration-300 shadow-2xl ${isSidebarOpen
              ? "translate-x-0"
              : "-translate-x-full md:translate-x-0"
            }`}
        >
          <div className="md:hidden flex justify-end p-4">
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="text-white hover:text-purple-200"
            >
              <FaTimes size={24} />
            </button>
          </div>

          <SidebarContent
            setIsSidebarOpen={setIsSidebarOpen}
            onLogout={handleLogout}
            currentUser={currentUser}
          />
        </div>
      )}

      {/* Overlay for mobile */}
      {isSidebarOpen && currentUser && (
        <div
          className="fixed inset-0 bg-black opacity-40 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Area */}
      <div className="flex-1 flex flex-col transition-all duration-300">
        {/* Navbar - only show if logged in */}
        {currentUser && (
          <div className="flex items-center justify-between bg-white px-4 md:px-8 py-4 shadow-sm border-b border-gray-200">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="text-gray-600 text-xl md:hidden"
              >
                <FaBars />
              </button>
              <h1 className="text-xl font-semibold text-gray-800 hidden md:block">
                {location.pathname === "/dashboard" ? "Dashboard" :
                  location.pathname === "/products" ? "Products" :
                    location.pathname === "/add-product" ? "Add Product" :
                      location.pathname === "/customers" ? "Customers" : "Overview"}
              </h1>
            </div>
            <div className="flex items-center space-x-6">
              <button className="bg-purple-600 text-white hover:bg-purple-700 cursor-pointer font-medium px-4 py-2 rounded-lg transition shadow-sm shadow-purple-200">
                + New Task
              </button>
              <div className="flex items-center space-x-3 pl-6 border-l border-gray-200">
                <img
                  src="https://i.pravatar.cc/150?img=13"
                  alt="Avatar"
                  className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
                />
                <div className="text-right leading-tight hidden md:flex md:flex-col">
                  <p className="text-sm font-bold text-gray-800">
                    {currentUser ? currentUser.email.split('@')[0] : "Plains Motor"}
                  </p>
                  <p className="text-xs text-gray-500 text-start uppercase tracking-wider">
                    {currentUser ? currentUser.role : "Guest"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Content with routing */}
        <div className={`p-4 md:p-8 overflow-auto flex justify-center ${!currentUser ? 'h-full items-center bg-gray-100' : 'bg-gray-50'}`}>
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
                    requireAdmin={false}
                    loginPath="/admin/login"
                  />
                }
              />
              <Route
                path="/Update-NewProduct/:id?"
                element={
                  <ProtectedRoute
                    element={<UpdateNewProduct />}
                    requireAdmin={false}
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
                    requireAdmin={false}
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
