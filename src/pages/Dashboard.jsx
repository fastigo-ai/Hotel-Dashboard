import React, { useEffect, useState } from 'react';
import { FaHotel, FaUserPlus, FaDollarSign } from 'react-icons/fa';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { getDashboardData } from '../api/Api';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
       const res = await getDashboardData();

        if (res.success) {
          // Format revenue to USD if not already formatted
          if (!res.data.totalRevenue.formatted) {
            res.data.totalRevenue.formatted = new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
            }).format(res.data.totalRevenue.amount);
          }
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

  // Prepare chart data
  const revenueChartData = data.salesReport.monthlyData.filter(month => month.revenue > 0);
  
  // Prepare pie chart data for payment breakdown
  const paymentData = [
    { name: 'Succeeded', value: data.paymentBreakdown.succeeded, color: '#10b981' },
    { name: 'Failed', value: 0, color: '#ef4444' },
  ];

  // Prepare occupancy data
  const occupancyData = [
    { name: 'Occupied', value: parseFloat(data.summary.occupancyRate), color: '#3b82f6' },
    { name: 'Available', value: 100 - parseFloat(data.summary.occupancyRate), color: '#e5e7eb' }
  ];

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
          title="Total Bookings"
          value={data.totalBookings.count}
          icon={<FaHotel />}
          change={`${data.totalBookings.percentage} ${data.totalBookings.label}`}
          positive={data.totalBookings.trend === 'up'}
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
          <p className="text-sm text-gray-300 mt-1">Avg: {data.totalRevenue.avgPerBooking} per booking</p>
        </div>

        <Card
          title="Occupancy Rate"
          value={data.summary.occupancyRate}
          icon={<FaHotel />}
          change={`Top month: ${data.summary.topPerformingMonth}`}
          positive={true}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Revenue Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
            <h2 className="text-lg font-semibold">Revenue Report</h2>
            <select className="border p-1 rounded-md text-sm" defaultValue={data.salesReport.period}>
              <option>{data.salesReport.period}</option>
              <option>This Month</option>
              <option>Last Month</option>
              <option>This Year</option>
            </select>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="monthName" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bookings Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Monthly Bookings</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="monthName" />
                <YAxis />
                <Tooltip formatter={(value) => [value, 'Bookings']} />
                <Bar dataKey="bookings" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Pie Charts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Payment Success Rate */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Payment Success</h2>
          <div className="h-48 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={paymentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {paymentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="text-center">
            <p className="text-green-600 font-semibold">{data.paymentBreakdown.succeeded} Successful</p>
          </div>
        </div>

        {/* Occupancy Rate */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Occupancy Rate</h2>
          <div className="h-48 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={occupancyData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {occupancyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, 'Rate']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="text-center">
            <p className="text-blue-600 font-semibold">{data.summary.occupancyRate} Occupied</p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-3 max-h-48 overflow-y-auto">
            {data.recentActivity.slice(0, 5).map((activity, index) => (
              <div key={activity.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <div className="flex-1">
                  <p className="font-medium text-sm">{activity.customerName}</p>
                  <p className="text-xs text-gray-500">{activity.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600">{activity.amount}</p>
                  <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded">
                    {activity.status}
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.topProperties.map((property) => (
            <div key={property.id} className="border rounded-lg p-4">
              <h3 className="font-semibold text-sm mb-2">{property.name}</h3>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-lg font-bold text-green-600">{property.revenue}</p>
                  <p className="text-sm text-gray-500">{property.bookings} bookings</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-yellow-500">★ {property.rating}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Date Range Footer */}
      <div className="mt-6 text-center text-sm text-gray-500 border-t pt-4">
        {data.dateRange}
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