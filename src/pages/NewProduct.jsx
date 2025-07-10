// src/components/UpdateProductForm.js
import React, { useState, useCallback } from "react";
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
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Memoized change handler to prevent unnecessary re-renders
  const handleChange = useCallback((e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
    // Clear error when user starts typing
    if (error) setError("");
  }, [error]);

  // Form validation
  const validateForm = () => {
    const requiredFields = ["name", "title", "price", "rating", "category"];
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      setError(`Please fill in: ${missingFields.join(", ")}`);
      return false;
    }

    if (formData.price <= 0) {
      setError("Price must be greater than 0");
      return false;
    }

    if (formData.rating < 0 || formData.rating > 5) {
      setError("Rating must be between 0 and 5");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    setError("");

    try {
      const result = await uploadProduct(formData);
      console.log("✅ Upload success:", result);
      navigate(`/update-NewProduct/${result._id}`);
    } catch (err) {
      console.error("❌ Upload failed:", err);
      setError(err.response?.data?.message || "Failed to upload product. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = useCallback(() => {
    navigate("/");
  }, [navigate]);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold mb-6">Update Product</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-purple-500 focus:border-purple-500"
            required
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
            className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-purple-500 focus:border-purple-500"
          />
          {formData.image && (
            <p className="mt-1 text-sm text-gray-600">
              Selected: {formData.image.name}
            </p>
          )}
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-purple-500 focus:border-purple-500"
            required
          />
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Price <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            min="0"
            step="0.01"
            className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-purple-500 focus:border-purple-500"
            required
          />
        </div>

        {/* Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Rating <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="rating"
            step="0.1"
            min="0"
            max="5"
            value={formData.rating}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-purple-500 focus:border-purple-500"
            required
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
            className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-purple-500 focus:border-purple-500"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-purple-500 focus:border-purple-500"
            required
          >
            <option value="">Select Category</option>
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Kids">Kids</option>
          </select>
        </div>

        {/* Buttons */}
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            disabled={isLoading}
          >
            {isLoading ? "Uploading..." : "Continue"}
          </button>
          <button
            type="button"
            className="border border-purple-600 text-purple-600 px-6 py-2 rounded hover:bg-purple-50 transition-colors"
            onClick={handleCancel}
            disabled={isLoading}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateProductForm;