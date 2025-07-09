import React, { useState } from "react";
import {
  FaBars,
  FaTimes,
  FaSearch,
  FaRedoAlt,
  FaBell,
  FaHome,
} from "react-icons/fa";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import Dashboard from "../../pages/Dashboard";
import Products from "../../pages/Products";
import NewProduct from "../../pages/NewProduct";
import Customers from "../../pages/Customers";
import UpdateNewProduct from "../../pages/productdetail/UpdateNewProduct";
// import other pages similarly

export default function NavbarWithSidebar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const menuItems = [
    { label: "Dashboard", path: "/" },
    { label: "Products", path: "/products" },
    { label: "Add New Product", path: "/add-product" },
    { label: "Customers", path: "/customers" },
    { label: "Customers Details", path: "/customer-details" },
    { label: "Orders", path: "/orders" },
    { label: "Order Details", path: "/order-details" },
    { label: "Refund", path: "/refund" },
  ];

  return (
    <Router>
      <div className="h-screen bg-gray-100 flex overflow-hidden">
        {/* Sidebar */}
        <div
          className={`fixed md:static top-0 left-0 h-full w-64 bg-purple-700 text-white z-50 transform transition-transform duration-300 ${
            isSidebarOpen
              ? "translate-x-0"
              : "-translate-x-full md:translate-x-0"
          }`}
        >
          <div className="flex justify-between items-center p-4 border-b border-purple-600">
            <Link
              to="/"
              className="text-xl font-bold font-serif whitespace-nowrap"
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
          <div className="p-4">
            <ul className="space-y-8">
              <li className="flex items-center gap-4 text-white font-semibold mb-4">
                <FaHome />
                Admin
              </li>
              {menuItems.map((item, index) => (
                <li key={index}>
                  <Link
                    to={item.path}
                    className="text-lg block hover:text-white/80 pl-12"
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li className="flex items-center gap-4 text-white font-semibold mb-4">
                <FaHome />
                Login
              </li>
            </ul>
          </div>
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
                className="text-gray-600  text-xl md:hidden"
              >
                <FaBars />
              </button>
              <button className="bg-blue-100 text-blue-600 hover:text-white cursor-pointer font-medium px-3 py-1 rounded-md hover:bg-blue-600 transition">
                New Task
              </button>
            </div>
            <div className="flex items-center space-x-4">
              <FaSearch className="text-gray-600 cursor-pointer" />
              <FaRedoAlt className="text-gray-600 cursor-pointer" />
              <FaBell className="text-gray-600 cursor-pointer" />
              <div className="flex items-center space-x-2">
                <img
                  src="https://i.pravatar.cc/30?img=13"
                  alt="Avatar"
                  className="w-9 h-9 rounded-full"
                />
                <div className="text-right leading-tight hidden md:flex md:flex-col">
                  <p className="text-xs text-gray-500 text-start">Admin</p>
                  <p className="text-sm font-semibold text-gray-800">
                    Maria Gibson
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area with Routing */}
          <div className="p-4 md:p-6 overflow-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/products" element={<Products />} />
              <Route path="/add-product" element={<NewProduct />} />
              <Route path="/Update-NewProduct/:id?" element={<UpdateNewProduct />} />
              <Route path="/customers" element={<Customers />} />
              
              
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}
