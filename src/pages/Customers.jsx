import React, { useEffect, useState } from "react";
import { FaEye, FaEdit, FaTrash, FaUsers, FaBed, FaCreditCard } from "react-icons/fa";
import { getConfirmedBookings } from "../api/Api";

const Customers = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getConfirmedBookings();
        
        if (response.success && response.data && response.data.bookings) {
          setBookings(response.data.bookings);
        } else {
          setError(response.message || "Failed to fetch bookings");
          setBookings([]);
        }
      } catch (error) {
        console.error("Error fetching bookings:", error);
        setError("Failed to load bookings. Please try again.");
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return "N/A";
    }
  };

  // Helper function to get status color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
        return "text-green-600 bg-green-100 px-2 py-1 rounded-full text-xs font-medium";
      case "pending":
        return "text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full text-xs font-medium";
      case "cancelled":
        return "text-red-600 bg-red-100 px-2 py-1 rounded-full text-xs font-medium";
      default:
        return "text-gray-600 bg-gray-100 px-2 py-1 rounded-full text-xs font-medium";
    }
  };

  // Helper function to get payment status color
  const getPaymentStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "succeeded":
        return "text-green-600 bg-green-100 px-2 py-1 rounded-full text-xs font-medium";
      case "pending":
        return "text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full text-xs font-medium";
      case "failed":
        return "text-red-600 bg-red-100 px-2 py-1 rounded-full text-xs font-medium";
      default:
        return "text-gray-600 bg-gray-100 px-2 py-1 rounded-full text-xs font-medium";
    }
  };

  const handleView = (booking) => {
    // You can replace this with navigation to a detailed view
    console.log("View booking:", booking);
    alert(`View booking for ${booking.userId.firstname} ${booking.userId.lastname}`);
  };

  const handleEdit = (id) => {
    // You can replace this with navigation to an edit form
    alert(`Edit booking ID: ${id}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this booking?")) {
      try {
        // Add your delete API call here
        // await deleteBooking(id);
        // Refresh the bookings list
        alert(`Delete booking ID: ${id}`);
      } catch (error) {
        console.error("Error deleting booking:", error);
        alert("Failed to delete booking. Please try again.");
      }
    }
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-6 bg-gray-100 min-h-screen">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="ml-4 text-gray-500">Loading bookings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 sm:p-6 bg-gray-100 min-h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
        <button 
          onClick={() => window.location.reload()} 
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
          Confirmed Hotel Bookings
        </h2>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600 bg-white px-3 py-1 rounded-full border">
            Total: {bookings.length} booking{bookings.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
        <table className="min-w-[900px] w-full divide-y divide-gray-200 text-sm sm:text-base">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Customer</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Phone</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Check-In/Out</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Property</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Room Details</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Amount</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Payment</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {bookings.map((booking) => (
              <tr key={booking._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-4">
                  <div className="flex flex-col">
                    <span className="font-semibold text-gray-900">
                      {booking.userId ? 
                        `${booking.userId.firstname || ''} ${booking.userId.lastname || ''}`.trim() || 'N/A'
                        : 'N/A'
                      }
                    </span>
                    <span className="text-sm text-gray-500">
                      {booking.userId?.email?.replace('@placeholder.com', '') || 'N/A'}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span className="text-gray-900">
                    {booking.userId?.mobile || 'N/A'}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-900">
                      In: {formatDate(booking.checkInDate)}
                    </span>
                    <span className="text-sm text-gray-500">
                      Out: {formatDate(booking.checkOutDate)}
                    </span>
                    <span className="text-xs text-blue-600 mt-1">
                      {booking.totalStay} night{booking.totalStay !== 1 ? 's' : ''}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-4">
                  {booking.property ? (
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-900">
                        {booking.property.title}
                      </span>
                      <div className="flex items-center mt-1">
                        <span className="text-sm text-gray-500">
                          ${booking.property.price}/night
                        </span>
                        <span className="ml-2 text-xs text-yellow-600">
                          ⭐ {booking.property.rating}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <span className="text-gray-400 italic">Property not found</span>
                  )}
                </td>
                <td className="px-4 py-4">
                  <div className="flex flex-col space-y-1">
                    <div className="flex items-center text-sm">
                      <FaBed className="mr-1 text-gray-400" />
                      <span className="capitalize">
                        {booking.roomDetails.roomType} × {booking.roomDetails.quantity}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <FaUsers className="mr-1 text-gray-400" />
                      <span>
                        {booking.guests.adults}A
                        {booking.guests.children > 0 && `, ${booking.guests.children}C`}
                        {booking.guests.infants > 0 && `, ${booking.guests.infants}I`}
                      </span>
                    </div>
                    {booking.roomDetails.extraPersons > 0 && (
                      <span className="text-xs text-orange-600">
                        +{booking.roomDetails.extraPersons} extra
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex flex-col">
                    <span className="font-bold text-lg text-green-600">
                      ${booking.totalAmount}
                    </span>
                    <span className="text-xs text-gray-500">
                      Total
                    </span>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex flex-col space-y-1">
                    <span className={getPaymentStatusColor(booking.payment?.paymentStatus)}>
                      <FaCreditCard className="inline mr-1" />
                      {booking.payment?.paymentStatus || 'Unknown'}
                    </span>
                    {booking.payment?.paymentIntentId && (
                      <span className="text-xs text-gray-500 font-mono">
                        {booking.payment.paymentIntentId.slice(-8)}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span className={getStatusColor(booking.bookingStatus)}>
                    {booking.bookingStatus || 'N/A'}
                  </span>
                </td>
               
              </tr>
            ))}
            {bookings.length === 0 && (
              <tr>
                <td colSpan="9" className="text-center py-12 text-gray-500">
                  <div className="flex flex-col items-center">
                    <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
                    <p className="text-gray-500">No confirmed bookings are available at the moment.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Summary Card */}
      {bookings.length > 0 && (
        <div className="mt-6 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Booking Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-blue-600 text-sm font-medium">Total Bookings</p>
              <p className="text-2xl font-bold text-blue-800">{bookings.length}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-green-600 text-sm font-medium">Total Revenue</p>
              <p className="text-2xl font-bold text-green-800">
                ${bookings.reduce((sum, booking) => sum + (booking.totalAmount || 0), 0).toFixed(2)}
              </p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-purple-600 text-sm font-medium">Total Nights</p>
              <p className="text-2xl font-bold text-purple-800">
                {bookings.reduce((sum, booking) => sum + (booking.totalStay || 0), 0)}
              </p>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <p className="text-orange-600 text-sm font-medium">Avg Booking Value</p>
              <p className="text-2xl font-bold text-orange-800">
                ${bookings.length ? (bookings.reduce((sum, booking) => sum + (booking.totalAmount || 0), 0) / bookings.length).toFixed(2) : '0.00'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;