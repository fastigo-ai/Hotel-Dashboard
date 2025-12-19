import React, { useEffect, useState } from "react";
import { FaHotel, FaUserPlus, FaDollarSign } from "react-icons/fa";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { getDashboardData } from "../api/Api";

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await getDashboardData();

        if (res.success) {
          if (!res.data.totalRevenue.formatted) {
            res.data.totalRevenue.formatted = new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(res.data.totalRevenue.amount);
          }
          setData(res.data);
        }
      } catch (err) {
        console.error("Dashboard fetch error:", err);
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

  /* ================= PREP DATA ================= */

  const revenueChartData = data.salesReport.monthlyData.filter(
    (m) => m.revenue > 0
  );

  const paymentData = [
    { name: "Succeeded", value: data.paymentBreakdown.succeeded, color: "#10b981" },
    { name: "Failed", value: data.paymentBreakdown.failed || 0, color: "#ef4444" },
  ];

  const occupancyData = [
    { name: "Occupied", value: parseFloat(data.summary.occupancyRate), color: "#3b82f6" },
    { name: "Available", value: 100 - parseFloat(data.summary.occupancyRate), color: "#e5e7eb" },
  ];

  // ✅ FIXED: Recent Activity (latest first, max 5)
  const recentActivities = [...data.recentActivity]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  /* ================= RENDER ================= */

  return (
    <div className="bg-[#f4f6fc] min-h-screen p-4 sm:p-6 text-gray-800">
      {/* Header */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold">DASHBOARD</h1>
          <p className="text-sm text-gray-500">Admin / Dashboard</p>
        </div>
        <button className="border px-4 py-1 rounded-md text-sm text-blue-500 bg-white">
          Today : {new Date(data.lastUpdated).toLocaleDateString("en-GB")}
        </button>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card
          title="Total Bookings"
          value={data.totalBookings.count}
          icon={<FaHotel />}
          change={`${data.totalBookings.percentage} ${data.totalBookings.label}`}
          positive={data.totalBookings.trend === "up"}
        />

        <Card
          title="New Customers"
          value={data.newCustomers.count}
          icon={<FaUserPlus />}
          change={`${data.newCustomers.percentage} ${data.newCustomers.label}`}
          positive={parseFloat(data.newCustomers.percentage) >= 0}
        />

        <div className="bg-gray-900 text-white p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Total Revenue</h2>
            <FaDollarSign className="text-2xl" />
          </div>
          <h3 className="text-3xl font-bold">
            {data.totalRevenue.formatted}
          </h3>
          <p className="text-sm text-gray-300 mt-1">
            Avg: {data.totalRevenue.avgPerBooking} per booking
          </p>
        </div>

        <Card
          title="Occupancy Rate"
          value={data.summary.occupancyRate}
          icon={<FaHotel />}
          change={`Top month: ${data.summary.topPerformingMonth}`}
          positive
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Revenue */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Revenue Report</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="monthName" />
                <YAxis />
                <Tooltip formatter={(v) => [`$${v}`, "Revenue"]} />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3b82f6"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bookings */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Monthly Bookings</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="monthName" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="bookings" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Pie + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Payment */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Payment Success</h2>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={paymentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={70}
                  dataKey="value"
                >
                  {paymentData.map((e, i) => (
                    <Cell key={i} fill={e.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Occupancy */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Occupancy Rate</h2>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={occupancyData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={70}
                  dataKey="value"
                >
                  {occupancyData.map((e, i) => (
                    <Cell key={i} fill={e.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => [`${v}%`, "Rate"]} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-3 max-h-48 overflow-y-auto">
            {recentActivities.map((a) => (
              <div
                key={a.id}
                className="flex justify-between items-center p-2 bg-gray-50 rounded"
              >
                <div>
                  <p className="font-medium text-sm">{a.customerName}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(a.date).toLocaleDateString("en-GB")}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600">{a.amount}</p>
                  <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded">
                    {a.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Properties */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Top Performing Properties</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {data.topProperties.map((p) => (
            <div key={p.id} className="border rounded-lg p-4">
              <h3 className="font-semibold text-sm">{p.name}</h3>
              <p className="text-green-600 font-bold">{p.revenue}</p>
              <p className="text-sm text-gray-500">{p.bookings} bookings</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 text-center text-sm text-gray-500 border-t pt-4">
        {data.dateRange}
      </div>
    </div>
  );
};

/* Card */
const Card = ({ title, value, icon, change, positive }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm">
    <div className="flex justify-between mb-4">
      <h2 className="font-semibold">{title}</h2>
      <div className="text-gray-400 text-xl">{icon}</div>
    </div>
    <h3 className="text-3xl font-bold">{value}</h3>
    <p className={`text-sm ${positive ? "text-green-500" : "text-red-500"}`}>
      {change}
    </p>
  </div>
);

export default Dashboard;
