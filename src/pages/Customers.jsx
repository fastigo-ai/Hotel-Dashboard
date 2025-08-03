import React, { useEffect, useState } from "react";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import { getBookings } from "../api/Api";

const Customers = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await getBookings();
        setBookings(data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handleView = (id) => alert(`View booking ID: ${id}`);
  const handleEdit = (id) => alert(`Edit booking ID: ${id}`);
  const handleDelete = (id) => alert(`Delete booking ID: ${id}`);

  return (
    <div className="p-4 sm:p-6 bg-gray-100 min-h-screen">
      <h2 className="text-xl sm:text-2xl font-semibold mb-4">Hotel Bookings</h2>

      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-[700px] w-full divide-y divide-gray-200 text-sm sm:text-base">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-700">Customer Name</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">Phone</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">Check-In</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">Check-Out</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">Room</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">Status</th>
                <th className="px-4 py-3 text-center font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {bookings.map((booking) => (
                <tr key={booking._id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3">{booking.name || "N/A"}</td>
                  <td className="px-4 py-3">{booking.phone || "N/A"}</td>
                  <td className="px-4 py-3">{booking.checkInDate || "N/A"}</td>
                  <td className="px-4 py-3">{booking.checkOutDate || "N/A"}</td>
                  <td className="px-4 py-3">{booking.roomType || "N/A"}</td>
                  <td
                    className={`px-4 py-3 font-semibold ${
                      booking.paymentStatus === "Paid"
                        ? "text-green-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {booking.paymentStatus || "Pending"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-center gap-2 sm:gap-3 text-lg">
                      <button
                        onClick={() => handleView(booking._id)}
                        className="text-blue-500 hover:text-blue-700"
                        title="View"
                      >
                        <FaEye />
                      </button>
                      <button
                        onClick={() => handleEdit(booking._id)}
                        className="text-green-500 hover:text-green-700"
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(booking._id)}
                        className="text-red-500 hover:text-red-700"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {bookings.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center py-6 text-gray-500 italic">
                    No bookings found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Customers;
