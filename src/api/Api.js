import axios from "axios";

// export const BASE_URL = "https://lionfish-app-mwu2u.ondigitalocean.app";
export const BASE_URL = "https://king-prawn-app-5az7w.ondigitalocean.app";

// const BASE_URL = "https://lionfish-app-mwu2u.ondigitalocean.app";

/**
 * Upload product data including image
 * @param {Object} formData - form data with image file
 * @param {string} token - auth token
 * @returns {Promise<Object>}
 */
export const uploadProduct = async (formData) => {
  try {
    const data = new FormData();

    // Append all key-value pairs to FormData
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });

    const response = await axios.post(
      `${BASE_URL}/api/property/add-property`,
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
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
export const uploadPropertyDetail = async (formData) => {
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

    const response = await axios.post(
      `${BASE_URL}/api/property/add-property-detail`,
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
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

export const deleteProperty = async (id) => {
  try {
    const response = await axios.delete(
      `${BASE_URL}/api/property/delete-property/${id}`
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting property:", error);
    throw error;
  }
};
export const updateProductDetail = async (id) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/api/property/update-property${id}`
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting property:", error);
    throw error;
  }
};

export const getPropertyCards = async () => {
  try {
    const response = await axios.get(
      `${BASE_URL}/api/property/get-all-properties`
    );
    return response.data; // assuming data is the array of cards
  } catch (error) {
    console.error("Error getting property cards:", error);
    throw error;
  }
};
export const getPropertyDetail = async (id) => {
  try {
    const response = await axios.get(
      `https://starfish-app-6yhui.ondigitalocean.app/api/property/getPropertyDetail/${id}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching property detail:", error);
    throw error;
  }
};

/**
 * Fetch dashboard data
 * @returns {Promise<Object>}
 */
export const getDashboardData = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/api/property/dashboard`);
    return response.data;
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    throw error;
  }
};

// If auth required, set token here
export const BOOKINGS_API = `${BASE_URL}/api/property/my-bookings`;
const token = localStorage.getItem("token");

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: token ? `Bearer ${token}` : "",
  },
});

export const getBookings = async () => {
  try {
    const res = await api.get("/api/property/my-bookings");
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getConfirmedBookings = async () => {
  try {
    const res = await api.get("/api/property/all-confirmed-bookings");
    return res.data;
  } catch (error) {
    throw error;
  }
};

