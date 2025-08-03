import React, { useEffect, useState } from 'react';
import { FaShoppingCart, FaUserPlus, FaGem, FaDollarSign } from 'react-icons/fa';
import User from '../assets/user.png';
import { getDashboardData } from '../api/Api'; // Adjust path if needed

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
console.log(data);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await getDashboardData();
        if (res.success) {
          // Format revenue to USD
          res.data.totalRevenue.formatted = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
          }).format(res.data.totalRevenue.amount);
          setData(res.data);
        } else {
          console.error('API error:', res);
        }
      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-500 text-xl">
        Loading dashboard...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500 text-xl">
        Failed to load dashboard data.
      </div>
    );
  }

  return (
    <div className="bg-[#f4f6fc] min-h-screen p-4 sm:p-6 text-gray-800">
      {/* Header */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold">DASHBOARD</h1>
          <p className="text-sm text-gray-500">Admin / Dashboard</p>
        </div>
        <button className="border px-4 py-1 rounded-md text-sm text-blue-500 border-blue-300 bg-white">
          Today : {new Date(data.lastUpdated).toLocaleDateString('en-GB')}
        </button>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card
          title="Total Orders"
          value={data.totalOrders.count}
          icon={<FaShoppingCart />}
          change={`${data.totalOrders.percentage} ${data.totalOrders.label}`}
          positive={parseFloat(data.totalOrders.percentage) >= 0}
        />

        <Card
          title="New Customers"
          value={data.newCustomers.count}
          icon={<FaUserPlus />}
          change={`${data.newCustomers.percentage} ${data.newCustomers.label}`}
          positive={parseFloat(data.newCustomers.percentage) >= 0}
        />

        <div className="bg-gray-900 text-white p-6 rounded-lg shadow-sm relative">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Total Revenue</h2>
            <FaDollarSign className="text-2xl" />
          </div>
          <h3 className="text-3xl font-bold">{data.totalRevenue.formatted}</h3>
        </div>
      </div>

      {/* Pie Chart + Sales Report */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Device Breakdown */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex flex-col sm:flex-row gap-4 items-center mb-4">
            <img src={User} alt="Guide" className="w-20 h-20 object-cover" />
            <h2 className="text-lg font-semibold text-center sm:text-left">
              A Guide to Analyze and Optimize Your Online Business
            </h2>
          </div>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
            <div className="w-32 h-32">
              {/* Static Pie Chart Placeholder */}
              <svg viewBox="0 0 36 36" className="w-full h-full">
                <path fill="#6b46c1" d="M18 2.0845 a 15.9155 15.9155 0 1 1 -13.737 8.003" />
                <path fill="#ecc94b" d="M4.263 10.0875 a 15.9155 15.9155 0 0 1 6.329 -6.329" />
                <path fill="#2b6cb0" d="M10.592 3.7585 a 15.9155 15.9155 0 0 1 7.408 -1.674" />
              </svg>
            </div>
            <div className="text-sm space-y-1">
              <p><span className="text-purple-600 font-semibold">{data.deviceBreakdown.tablet}</span></p>
              <p><span className="text-blue-600 font-semibold">{data.deviceBreakdown.desktop}</span></p>
              <p><span className="text-yellow-500 font-semibold">{data.deviceBreakdown.mobile}</span></p>
              <button className="mt-2 px-4 py-1 border rounded-md text-sm text-blue-500 border-blue-300 bg-white">
                View Details
              </button>
            </div>
          </div>
          <div className="mt-4 text-center text-sm border rounded-md py-2">
            {data.dateRange}
          </div>
        </div>

        {/* Sales Report */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
            <h2 className="text-lg font-semibold">Sales Report</h2>
            <select className="border p-1 rounded-md text-sm" defaultValue={data.salesReport.period}>
              <option>This Month</option>
              <option>Last Month</option>
              <option>This Year</option>
            </select>
          </div>
          <div className="h-48 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-sm">
            Sales Chart Placeholder
          </div>
        </div>
      </div>
    </div>
  );
};

// Card Component
const Card = ({ title, value, icon, change, positive = true }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-lg font-semibold">{title}</h2>
      <div className="text-2xl text-gray-400">{icon}</div>
    </div>
    <h3 className="text-3xl font-bold">{value}</h3>
    <p className={`mt-1 text-sm ${positive ? 'text-green-500' : 'text-red-400'}`}>{change}</p>
  </div>
);

export default Dashboard;
