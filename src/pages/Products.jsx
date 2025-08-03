import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { getPropertyCards, deleteProperty } from "../api/Api"; // Adjust path if needed
// import '../App.css'
const Products = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const itemsPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getPropertyCards();
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete?")) return;
    try {
      await deleteProperty(id);
      setProducts(products.filter((p) => p._id !== id));
      alert("Deleted successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to delete");
    }
  };

  const filtered = products.filter((p) =>
    (p.title || p.name).toLowerCase().includes(search.toLowerCase())
  );

  const currentItems = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  return (
    <div className="p-4 sm:p-6 bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-2 sm:gap-0">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Products</h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          Add Product
        </button>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search by name..."
        className="w-full mb-4 px-4 py-2 border rounded"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Table */}
      {loading ? (
        <p>Loading products...</p>
      ) : (
       <div className="w-full overflow-x-auto bg-white rounded-lg shadow">
  <div className="min-w-[600px]"> {/* Ensure this div has a minimum width */}
    <table className="w-full text-sm text-left border-collapse">
      <thead className="bg-gray-100 text-gray-600 uppercase text-xs font-semibold">
        <tr>
          <th className="p-4 whitespace-nowrap">Property</th>
          <th className="p-4 whitespace-nowrap">Status</th>
          <th className="p-4 whitespace-nowrap">Price</th>
          <th className="p-4 whitespace-nowrap">Date</th>
          <th className="p-4 whitespace-nowrap text-center">Actions</th>
        </tr>
      </thead>
      <tbody>
        {currentItems.map((product) => (
          <tr key={product._id} className="border-b text-sm">
            <td className="px-4 py-4 flex items-center gap-3 min-w-[220px]">
              <img
                src={product.image || product.images?.[0] || "/placeholder.jpg"}
                alt="product"
                className="w-14 h-14 sm:w-16 sm:h-16 object-cover rounded flex-shrink-0"
              />
              <div className="flex flex-col overflow-hidden">
                <span className="font-medium truncate w-32 sm:w-auto">
                  {product.name || product.title}
                </span>
                <span className="text-xs text-gray-500 truncate w-32 sm:w-auto">
                  {product.location}
                </span>
              </div>
            </td>
            <td className="px-4 py-4">
              <span
                className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${
                  product.status === "In stock"
                    ? "bg-green-100 text-green-600"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {product.status || "In stock"}
              </span>
            </td>
            <td className="px-4 py-4 font-semibold text-gray-800 whitespace-nowrap">
              ${product.price}
            </td>
            <td className="px-4 py-4 whitespace-nowrap">
              {new Date(product.createdAt || product.date).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </td>
            <td className="px-4 py-4 text-center">
              <div className="flex justify-center items-center gap-3">
                <FaEdit
                  className="text-blue-600 hover:text-blue-800 cursor-pointer"
                  onClick={() => navigate(`/update/${product._id}`)}
                />
                <FaTrash
                  className="text-red-500 hover:text-red-700 cursor-pointer"
                  onClick={() => handleDelete(product._id)}
                />
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>

      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 gap-2 flex-wrap">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index + 1)}
              className={`px-3 py-1 rounded ${
                currentPage === index + 1
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-gray-500"
              onClick={() => setShowModal(false)}
            >
              ✕
            </button>
            <h3 className="text-lg font-semibold mb-4">Add Product</h3>
            <form className="space-y-4">
              <input
                type="text"
                placeholder="Title"
                className="w-full border p-2 rounded"
              />
              <input
                type="text"
                placeholder="Subtitle"
                className="w-full border p-2 rounded"
              />
              <input
                type="number"
                placeholder="Price"
                className="w-full border p-2 rounded"
              />
              <button
                type="submit"
                className="bg-indigo-600 text-white px-4 py-2 rounded w-full"
              >
                Save
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
