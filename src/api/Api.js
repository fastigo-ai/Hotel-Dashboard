import axios from "axios";

const BASE_URL = "https://starfish-app-6yhui.ondigitalocean.app";

/**
 * Upload product data including image
 * @param {Object} formData - form data with image file
 * @param {string} token - auth token
 * @returns {Promise<Object>}
 */
export const uploadProduct = async (formData, token) => {
  if (!token) {
    console.error("❌ uploadProduct: Missing token. Cannot upload product.");
    throw new Error("Unauthorized: No token provided");
  }

  try {
    const data = new FormData();

    // Append all key-value pairs to FormData
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });

    console.log("⬆️ Uploading product with token:", token);

    const response = await axios.post(
      `${BASE_URL}/api/property/add-property`,
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("✅ Product uploaded:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ API Error (uploadProduct):", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    throw error;
  }
};

/**
 * Upload detailed property data with multiple images
 * @param {Object} formData - form fields + file array
 * @param {string} token - auth token
 * @returns {Promise<Object>}
 */
export const uploadPropertyDetail = async (formData, token) => {
  if (!token) {
    console.error("❌ uploadPropertyDetail: Missing token. Cannot upload details.");
    throw new Error("Unauthorized: No token provided");
  }

  try {
    const data = new FormData();

    // Append fields
    Object.keys(formData).forEach((key) => {
      if (key === "files" && Array.isArray(formData.files)) {
        formData.files.forEach((file) => {
          if (file) {
            data.append("files", file); // Append multiple files
          }
        });
      } else {
        data.append(key, formData[key]);
      }
    });

    console.log("⬆️ Uploading property detail with token:", token);

    const response = await axios.post(
      `${BASE_URL}/api/property/add-property-detail`,
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("✅ Property detail uploaded:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ API Error (uploadPropertyDetail):", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    throw error;
  }
};
