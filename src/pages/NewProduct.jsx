// src/components/UpdateProductForm.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { uploadProduct } from "../api/Api";

const UpdateProductForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    image: null,
    title: "",
    price: "",
    rating: "",
    badge: "",
    category: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent form from refreshing the page
    try {
      const result = await uploadProduct(formData);
      console.log("✅ Upload success:", result);
      navigate(`/update-NewProduct/${result._id}`); // or wherever you want to redirect
    } catch (err) {
      console.error("❌ Upload failed:", err);
      alert("Failed to upload product.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold mb-6">Update Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Image</label>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Price</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        {/* Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Rating</label>
          <input
            type="number"
            name="rating"
            step="0.1"
            value={formData.rating}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        {/* Badge */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Badge</label>
          <input
            type="text"
            name="badge"
            value={formData.badge}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          >
            <option value="">Select Category</option>
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Kids">Kids</option>
          </select>
        </div>

        {/* Buttons */}
        <div className="flex gap-4">
          <button
            type="submit"
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
            disabled={isLoading}
          >
            {isLoading ? "Uploading..." : "Continue"}
          </button>
          <button
            type="button"
            className="border border-purple-600 text-purple-600 px-4 py-2 rounded hover:bg-purple-50"
            onClick={() => navigate("/")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateProductForm;
