import React from 'react';
import { FaShoppingCart, FaUserPlus, FaGem, FaDollarSign } from 'react-icons/fa';
import User from '../assets/user.png';

const Dashboard = () => {
  return (
    <div className="bg-[#f4f6fc] min-h-screen p-4 sm:p-6 text-gray-800">
      {/* Header */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold">DASHBOARD</h1>
          <p className="text-sm text-gray-500">Admin / Dashboard</p>
        </div>
        <button className="border px-4 py-1 rounded-md text-sm text-blue-500 border-blue-300 bg-white">
          Today : 04-Jun-2025
        </button>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Total Orders */}
        <Card title="Total Orders" value="14253" icon={<FaShoppingCart />} change="8.5% New Sessions Today" positive />

        {/* New Customers */}
        <Card title="New Customers" value="532" icon={<FaUserPlus />} change="0.6% Bounce Rate Weekly" positive={false} />

        {/* Top Coupons */}
        <Card title="Top Coupons" value="78%" icon={<FaGem className="text-yellow-300" />} change="1.5% Weekly Avg.Sessions" positive />

        {/* Revenue */}
        <div className="bg-gray-900 text-white p-6 rounded-lg shadow-sm relative">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Total Revenue</h2>
            <FaDollarSign className="text-2xl" />
          </div>
          <h3 className="text-3xl font-bold">$85,000</h3>
          {/* <p className="text-green-400 text-sm mt-1">10.5% Completions Weekly</p>
          <button className="absolute bottom-4 right-4 bg-purple-600 text-white px-4 py-1 rounded-md text-sm">
            Withdrawal
          </button> */}
        </div>
      </div>

      {/* Pie Chart + Sales Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Guide with Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex flex-col sm:flex-row gap-4 items-center mb-4">
            <img src={User} alt="Guide" className="w-20 h-20 object-cover" />
            <h2 className="text-lg font-semibold text-center sm:text-left">
              A Guide to Analyze and Optimize Your Online Business
            </h2>
          </div>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
            <div className="w-32 h-32">
              {/* Pie Chart */}
              <svg viewBox="0 0 36 36" className="w-full h-full">
                <path fill="#6b46c1" d="M18 2.0845 a 15.9155 15.9155 0 1 1 -13.737 8.003" />
                <path fill="#ecc94b" d="M4.263 10.0875 a 15.9155 15.9155 0 0 1 6.329 -6.329" />
                <path fill="#2b6cb0" d="M10.592 3.7585 a 15.9155 15.9155 0 0 1 7.408 -1.674" />
              </svg>
            </div>
            <div className="text-sm space-y-1">
              <p><span className="text-purple-600 font-semibold">Tablet</span></p>
              <p><span className="text-blue-600 font-semibold">Desktop</span></p>
              <p><span className="text-yellow-500 font-semibold">Mobile</span></p>
              <button className="mt-2 px-4 py-1 border rounded-md text-sm text-blue-500 border-blue-300 bg-white">
                View Details
              </button>
            </div>
          </div>
          <div className="mt-4 text-center text-sm border rounded-md py-2">
            01 January 2023 to 31 December 2024
          </div>
        </div>

        {/* Sales Report */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
            <h2 className="text-lg font-semibold">Sales Report</h2>
            <select className="border p-1 rounded-md text-sm">
              <option>This Month</option>
              <option>Last Month</option>
              <option>This Year</option>
            </select>
          </div>
          <div className="h-48 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-sm">
            Sales Chart (Last Year vs This Year)
          </div>
        </div>
      </div>

      {/* Earnings Report Table */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-md border border-gray-200 overflow-x-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
          <h3 className="text-xl font-semibold text-gray-800">Earnings Reports</h3>
          <span className="bg-purple-600 text-white px-3 py-1 text-xs rounded shadow-sm">$18,532</span>
        </div>

        <table className="w-full text-sm text-gray-700 min-w-[600px]">
          <thead>
            <tr className="text-left text-gray-500 border-b">
              <th className="pb-3">Date</th>
              <th className="pb-3">Item Count</th>
              <th className="pb-3">Tax</th>
              <th className="pb-3 text-end">Earnings</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["01 January", 50, "70", "15,000"],
              ["02 January", 25, "0", "15,000"],
              ["03 January", 65, "115", "35,000"],
              ["04 January", 20, "0", "8,500"],
              ["05 January", 20, "0", "8,500"],
              ["06 January", 40, "60", "12,000"]
            ].map(([date, count, tax, earn], i) => (
              <tr
                key={i}
                className={`border-b hover:bg-gray-50 transition-all ${
                  i % 2 === 0 ? "bg-white" : "bg-gray-50"
                }`}
              >
                <td className="py-3">{date}</td>
                <td>{count}</td>
                <td className={`text-sm ${tax !== "0" ? "text-red-500 font-medium" : "text-gray-400"}`}>
                  ${tax}
                </td>
                <td className="text-end font-semibold text-gray-800">${earn}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Stats Card Component
const Card = ({ title, value, icon, change, positive = true }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-lg font-semibold">{title}</h2>
      <div className="text-2xl text-gray-400">{icon}</div>
    </div>
    <h3 className="text-3xl font-bold">{value}</h3>
    <p className={`mt-1 text-sm ${positive ? "text-green-500" : "text-red-400"}`}>{change}</p>
  </div>
);

export default Dashboard;
