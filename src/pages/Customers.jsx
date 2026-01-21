import React, { useEffect, useState, useMemo } from "react";
import {
  FaUsers,
  FaBed,
  FaCreditCard,
  FaSearch,
} from "react-icons/fa";
import { getConfirmedBookings } from "../api/Api";

const Customers = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* 🔍 Filters */
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");

  /* ================= Fetch bookings ================= */
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const response = await getConfirmedBookings();

        if (response?.success && response?.data?.bookings) {
          // 🔥 Latest bookings first
          const sorted = [...response.data.bookings].sort(
            (a, b) =>
              new Date(b.createdAt || b.checkInDate) -
              new Date(a.createdAt || a.checkInDate)
          );
          setBookings(sorted);
        } else {
          setError("Failed to fetch bookings");
          setBookings([]);
        }
      } catch (err) {
        setError("Failed to load bookings");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  /* ================= Search + Filter logic ================= */
  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const user = booking.userId || {};
      const property = booking.property || {};
      const searchText = search.toLowerCase();

      const matchesSearch =
        user.firstname?.toLowerCase().includes(searchText) ||
        user.lastname?.toLowerCase().includes(searchText) ||
        user.email?.toLowerCase().includes(searchText) ||
        user.mobile?.includes(searchText) ||
        property.title?.toLowerCase().includes(searchText);

      const matchesStatus =
        statusFilter === "all" ||
        booking.bookingStatus === statusFilter;

      const matchesPayment =
        paymentFilter === "all" ||
        booking.payment?.paymentStatus === paymentFilter;

      return matchesSearch && matchesStatus && matchesPayment;
    });
  }, [bookings, search, statusFilter, paymentFilter]);

  /* ================= Helpers ================= */
  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-US", {
      timeZone: "America/Toronto",
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const badge = (color) =>
    `px-2 py-1 rounded-full text-xs font-medium inline-flex items-center ${color}`;

  const bookingStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
        return badge("bg-green-100 text-green-600");
      case "pending":
        return badge("bg-yellow-100 text-yellow-600");
      case "cancelled":
        return badge("bg-red-100 text-red-600");
      default:
        return badge("bg-gray-100 text-gray-600");
    }
  };

  const paymentStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "succeeded":
        return badge("bg-green-100 text-green-600");
      case "pending":
        return badge("bg-yellow-100 text-yellow-600");
      case "failed":
        return badge("bg-red-100 text-red-600");
      default:
        return badge("bg-gray-100 text-gray-600");
    }
  };

  /* ================= Loading / Error ================= */
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin h-12 w-12 border-b-2 border-blue-600 rounded-full" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-600 p-6">{error}</div>;
  }

  /* ================= Render ================= */
  return (
    <div className="p-4 sm:p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-semibold mb-4">Confirmed Bookings</h2>

      {/* 🔍 Search + Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search */}
        <div className="relative">
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search customer, email, phone, property"
            className="pl-10 w-full border rounded px-3 py-2"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Booking Status */}
        <select
          className="border rounded px-3 py-2"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Booking Status</option>
          <option value="confirmed">Confirmed</option>
          <option value="pending">Pending</option>
          <option value="cancelled">Cancelled</option>
        </select>

        {/* Payment Status */}
        <select
          className="border rounded px-3 py-2"
          value={paymentFilter}
          onChange={(e) => setPaymentFilter(e.target.value)}
        >
          <option value="all">All Payment Status</option>
          <option value="succeeded">Succeeded</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
        </select>

        {/* Count */}
        <div className="flex items-center justify-end text-sm text-gray-600">
          Showing <strong className="mx-1">{filteredBookings.length}</strong>{" "}
          bookings
        </div>
      </div>

      {/* 📋 Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-[900px] w-full divide-y">
          <thead className="bg-gray-50 text-sm font-semibold">
            <tr>
              <th className="px-4 py-3 text-left">Customer</th>
              <th className="px-4 py-3">Dates</th>
              <th className="px-4 py-3">Property</th>
              <th className="px-4 py-3">Room</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Payment</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>

          <tbody className="divide-y text-sm">
            {filteredBookings.map((b) => (
              <tr key={b._id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="font-semibold">
                    {b.userId?.firstname} {b.userId?.lastname}
                  </div>
                  <div className="text-xs text-gray-500">
                    {b.userId?.email}
                  </div>
                </td>

                <td className="px-4 py-3">
                  <div>In: {formatDate(b.checkInDate)}</div>
                  <div className="text-gray-500">
                    Out: {formatDate(b.checkOutDate)}
                  </div>
                </td>

                <td className="px-4 py-3">{b.property?.title}</td>

                <td className="px-4 py-3">
                  <FaBed className="inline mr-1" />
                  {b.roomDetails?.roomType} × {b.roomDetails?.quantity}
                  <div className="text-xs text-gray-500">
                    <FaUsers className="inline mr-1" />
                    {b.guests?.adults}A, {b.guests?.children || 0}C
                  </div>
                </td>

                <td className="px-4 py-3 font-bold text-green-600">
                  ${b.totalAmount}
                </td>

                <td className="px-4 py-3">
                  <span className={paymentStatusBadge(b.payment?.paymentStatus)}>
                    <FaCreditCard className="mr-1" />
                    {b.payment?.paymentStatus || "unknown"}
                  </span>
                </td>

                <td className="px-4 py-3">
                  <span className={bookingStatusBadge(b.bookingStatus)}>
                    {b.bookingStatus || "unknown"}
                  </span>
                </td>
              </tr>
            ))}

            {filteredBookings.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center py-10 text-gray-500">
                  No bookings match your search
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Customers;
