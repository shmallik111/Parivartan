import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Centralized API client for all backend requests
 * Handles authentication, error handling, and interceptors
 */

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Request interceptor: Add token to all requests
 */
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error("Error retrieving token:", error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor: Handle errors and token refresh
 */
api.interceptors.response.use(
  (response) => {
    // Return the data directly for cleaner API usage
    return response.data;
  },
  async (error) => {
    const { response, message } = error;

    if (response?.status === 401) {
      // Unauthorized - token expired or invalid
      await AsyncStorage.removeItem("authToken");
      // You can dispatch a logout action or navigate to login screen here
      console.warn("Unauthorized - Token expired or invalid");
    }

    if (response?.status === 403) {
      // Forbidden - user doesn't have permission
      console.warn("Forbidden - User lacks permission");
    }

    if (!response) {
      // Network error
      console.error("Network error:", message);
      throw {
        success: false,
        message: "Network error. Please check your connection.",
        error: message,
      };
    }

    // Return error response
    throw response.data || {
      success: false,
      message: "An error occurred",
      error: message,
    };
  }
);

/**
 * Helper function to handle API errors
 */
const handleApiError = (error) => {
  if (error.response?.data?.error) {
    return error.response.data.error;
  }
  return error.message || "An error occurred";
};

export default api;
export { handleApiError };
