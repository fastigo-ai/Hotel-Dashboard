// src/components/UpdateNewProduct.js
import React, { useState } from "react";
import { uploadPropertyDetail } from "../../api/Api"; // ✅ Import the API call

const UpdateNewProduct = () => {
  const [formData, setFormData] = useState({
    cardId: "",
    name: "",
    title: "",
    location: "",
    guests: "",
    bathroom: "",
    rating: "",
    reviews: "",
    host: "",
    description: "",
    price: "",
    files: [null, null, null, null, null],
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (index, file) => {
    const updatedFiles = [...formData.files];
    updatedFiles[index] = file;
    setFormData((prev) => ({
      ...prev,
      files: updatedFiles,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await uploadPropertyDetail(formData);
      console.log("Property detail uploaded:", result);
      alert("Property detail uploaded successfully!");
    } catch (error) {
      alert("Failed to upload property detail. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold mb-6">Update New Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Form Inputs */}
        {[
          { label: "Card ID", name: "cardId" },
          { label: "Name", name: "name" },
          { label: "Title", name: "title" },
          { label: "Location", name: "location" },
          { label: "Guests", name: "guests", type: "number" },
          { label: "Bathroom", name: "bathroom", type: "number" },
          { label: "Rating", name: "rating", type: "number", step: "0.1" },
          { label: "Reviews", name: "reviews", type: "number" },
          { label: "Host", name: "host" },
          { label: "Price", name: "price", type: "number" },
        ].map(({ label, name, type = "text", step }) => (
          <div key={name}>
            <label className="block text-sm font-medium text-gray-700">{label}</label>
            <input
              type={type}
              name={name}
              value={formData[name]}
              onChange={handleChange}
              step={step}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>
        ))}

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            rows="4"
            value={formData.description}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            placeholder="Enter product description"
          />
        </div>

        {/* Image Uploads */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Upload Images</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[0, 1, 2, 3, 4].map((index) => (
              <input
                key={index}
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(index, e.target.files[0])}
                className="block w-full border border-gray-300 rounded-md p-2"
              />
            ))}
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-4 mt-6">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Save Product"}
          </button>
          <button
            type="button"
            className="border border-blue-600 text-blue-600 px-4 py-2 rounded hover:bg-blue-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateNewProduct;
