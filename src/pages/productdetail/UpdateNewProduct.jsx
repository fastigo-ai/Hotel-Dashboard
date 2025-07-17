// src/components/UpdateNewProduct.js
import React, { useState, useCallback, useMemo } from "react";
import { uploadPropertyDetail } from "../../api/Api"; 
import { useParams, useNavigate } from "react-router-dom";

const UpdateNewProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    cardId: id,
    name: "",
    title: "",
    location: "",
    guests: "",
    bedroom: "",
    bed: "",
    bathroom: "",
    rating: "",
    reviews: "",
    description: "",
    price: "",
    roomType: "",
    quantity: "",
    defaultAllowedPersons: "",
    allowedPersonsPerRoom: "",
    extraPersonCharge: "",
    isSmokingAllowed: false,
    smokingRoomCharge: "",
    isPetFriendly: false,
    allowedPets: "",
    petFeePerPet: "",
    files: [null, null, null, null, null],
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);

  // Memoized form fields configuration
  const formFields = useMemo(() => [
    { label: "Card ID", name: "cardId", disabled: true, required: true },
    { label: "Name", name: "name", required: true },
    { label: "Title", name: "title", required: true },
    { label: "Location", name: "location", required: true },
    { label: "Guests", name: "guests", type: "number", min: 1, required: true },
    { label: "Bedrooms", name: "bedroom", type: "number", min: 1, required: true },
    { label: "Beds", name: "bed", type: "number", min: 1, required: true },
    { label: "Bathroom", name: "bathroom", type: "number", min: 1, required: true },
    { label: "Rating", name: "rating", type: "number", step: "0.1", min: 0, max: 5, required: true },
    { label: "Reviews", name: "reviews", type: "number", min: 0, required: true },
    { label: "Price", name: "price", type: "number", min: 0, step: "0.01", required: true },
    { label: "Quantity", name: "quantity", type: "number", min: 1, required: true },
    { label: "Default Allowed Persons", name: "defaultAllowedPersons", type: "number", min: 1, required: true },
    { label: "Allowed Persons Per Room", name: "allowedPersonsPerRoom", type: "number", min: 1, required: true },
    { label: "Extra Person Charge", name: "extraPersonCharge", type: "number", min: 0, required: true },
  ], []);

  // Form validation
  const validateForm = useCallback(() => {
    const requiredFields = formFields.filter(field => field.required);
    const missingFields = requiredFields.filter(field => !formData[field.name]);
    
    if (missingFields.length > 0) {
      setError(`Please fill in: ${missingFields.map(f => f.label).join(", ")}`);
      return false;
    }

    // Validate specific fields
    if (formData.rating && (formData.rating < 0 || formData.rating > 5)) {
      setError("Rating must be between 0 and 5");
      return false;
    }

    if (formData.price && formData.price <= 0) {
      setError("Price must be greater than 0");
      return false;
    }

    if (formData.guests && formData.guests <= 0) {
      setError("Number of guests must be greater than 0");
      return false;
    }

    if (formData.bathroom && formData.bathroom <= 0) {
      setError("Number of bathrooms must be greater than 0");
      return false;
    }

    return true;
  }, [formData, formFields]);

  // Memoized change handler
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    // Clear error when user starts typing
    if (error) setError("");
  }, [error]);

  // Optimized file change handler
  const handleFileChange = useCallback((index, file) => {
    if (file) {
      // Validate file
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      const maxSize = 20 * 1024 * 1024; // 5MB

      if (!allowedTypes.includes(file.type)) {
        setError(`Invalid file type for image ${index + 1}. Please upload JPG, PNG, GIF, or WebP images.`);
        return;
      }

      if (file.size > maxSize) {
        setError(`File size too large for image ${index + 1}. Please upload images smaller than 5MB.`);
        return;
      }
    }

    setFormData((prev) => {
      const updatedFiles = [...prev.files];
      updatedFiles[index] = file;
      return {
        ...prev,
        files: updatedFiles,
      };
    });
    
    if (error) setError("");
  }, [error]);

  // Submit handler
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    setError("");
    setUploadProgress(0);

    try {
      const result = await uploadPropertyDetail(formData, {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        },
      });
      
      console.log("✅ Property detail uploaded:", result);
      
      // Success feedback
      alert("Property detail uploaded successfully!");
      navigate('/add-product')
      
      // Optional: Navigate to another page
      // navigate(`/product/${result._id}`);
      
    } catch (error) {
      console.error("❌ Upload failed:", error);
      setError(error.message || "Failed to upload property detail. Please try again.");
    } finally {
      setIsLoading(false);
      setUploadProgress(0);
    }
  }, [formData, validateForm]);

  // Cancel handler
  const handleCancel = useCallback(() => {
    if (window.confirm("Are you sure you want to cancel? All changes will be lost.")) {
      navigate(-1); // Go back to previous page
    }
  }, [navigate]);

  // Remove file handler
  const handleRemoveFile = useCallback((index) => {
    setFormData((prev) => {
      const updatedFiles = [...prev.files];
      updatedFiles[index] = null;
      return {
        ...prev,
        files: updatedFiles,
      };
    });
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold mb-6">Update New Product</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {isLoading && uploadProgress > 0 && (
        <div className="mb-4 p-3 bg-blue-100 border border-blue-400 text-blue-700 rounded">
          <div className="flex justify-between items-center mb-2">
            <span>Uploading...</span>
            <span>{uploadProgress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Dynamic Form Inputs */}
        {formFields.map(({ label, name, type = "text", step, min, max, disabled, required }) => (
          <div key={name}>
            <label className="block text-sm font-medium text-gray-700">
              {label} {required && <span className="text-red-500">*</span>}
            </label>
            <input
              type={type}
              name={name}
              value={formData[name]}
              onChange={handleChange}
              step={step}
              min={min}
              max={max}
              disabled={disabled}
              required={required}
              className={`mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500 ${
                disabled ? 'bg-gray-100 cursor-not-allowed' : ''
              }`}
            />
          </div>
        ))}

        {/* Room Type Select */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Room Type <span className="text-red-500">*</span>
          </label>
          <select
            name="roomType"
            value={formData.roomType}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select Room Type</option>
            <option value="single">Single</option>
            <option value="double">Double</option>
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            name="description"
            rows="4"
            value={formData.description}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter detailed product description"
          />
        </div>

        {/* Smoking and Pet Policies */}
        <div className="space-y-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isSmokingAllowed"
              name="isSmokingAllowed"
              checked={formData.isSmokingAllowed}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="isSmokingAllowed" className="ml-2 block text-sm text-gray-900">
              Smoking Allowed
            </label>
          </div>

          {formData.isSmokingAllowed && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Smoking Room Charge <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="smokingRoomCharge"
                value={formData.smokingRoomCharge}
                onChange={handleChange}
                min="0"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          )}

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isPetFriendly"
              name="isPetFriendly"
              checked={formData.isPetFriendly}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="isPetFriendly" className="ml-2 block text-sm text-gray-900">
              Pet Friendly
            </label>
          </div>

          {formData.isPetFriendly && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Allowed Pets <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="allowedPets"
                  value={formData.allowedPets}
                  onChange={handleChange}
                  min="0"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Pet Fee Per Pet <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="petFeePerPet"
                  value={formData.petFeePerPet}
                  onChange={handleChange}
                  min="0"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* Image Uploads */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Images (Up to 5 images)
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[0, 1, 2, 3, 4].map((index) => (
              <div key={index} className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(index, e.target.files[0])}
                  className="block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {formData.files[index] && (
                  <div className="mt-2 flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm text-gray-600 truncate">
                      {formData.files[index].name}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveFile(index)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Accepted formats: JPG, PNG, GIF, WebP. Max size: 5MB per image.
          </p>
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-4 mt-6">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Save Product"}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="border border-blue-600 text-blue-600 px-6 py-2 rounded hover:bg-blue-50 transition-colors"
            disabled={isLoading}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateNewProduct;