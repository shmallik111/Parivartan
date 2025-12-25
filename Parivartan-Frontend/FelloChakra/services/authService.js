import api, { handleApiError } from "./api";
import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Authentication service for signup, login, password reset, and email verification
 */

export const authService = {
  /**
   * Register a new user
   */
  signup: async (email, password, fullName) => {
    try {
      const response = await api.post("/auth/signup", {
        email,
        password,
        full_name: fullName,
      });

      if (response.token) {
        await AsyncStorage.setItem("authToken", response.token);
      }

      return {
        success: true,
        user: response.user,
        token: response.token,
      };
    } catch (error) {
      return {
        success: false,
        error: handleApiError(error),
      };
    }
  },

  /**
   * Login with email and password
   */
  login: async (email, password) => {
    try {
      const response = await api.post("/auth/login", { email, password });

      if (response.token) {
        await AsyncStorage.setItem("authToken", response.token);
      }

      return {
        success: true,
        user: response.user,
        token: response.token,
      };
    } catch (error) {
      return {
        success: false,
        error: handleApiError(error),
      };
    }
  },

  /**
   * Get current user profile
   */
  getProfile: async () => {
    try {
      const response = await api.get("/auth/profile");
      return {
        success: true,
        user: response,
      };
    } catch (error) {
      return {
        success: false,
        error: handleApiError(error),
      };
    }
  },

  /**
   * Logout user
   */
  logout: async () => {
    try {
      await AsyncStorage.removeItem("authToken");
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: "Failed to logout",
      };
    }
  },

  /**
   * Request password reset
   */
  forgotPassword: async (email) => {
    try {
      const response = await api.post("/auth/forgot-password", { email });
      return {
        success: true,
        message: response.message,
      };
    } catch (error) {
      return {
        success: false,
        error: handleApiError(error),
      };
    }
  },

  /**
   * Reset password with token
   */
  resetPassword: async (token, newPassword, confirmPassword) => {
    try {
      const response = await api.post("/auth/reset-password", {
        token,
        newPassword,
        confirmPassword,
      });

      return {
        success: true,
        message: response.message,
      };
    } catch (error) {
      return {
        success: false,
        error: handleApiError(error),
      };
    }
  },

  /**
   * Verify email with token
   */
  verifyEmail: async (token) => {
    try {
      const response = await api.post("/auth/verify-email", { token });
      return {
        success: true,
        message: response.message,
      };
    } catch (error) {
      return {
        success: false,
        error: handleApiError(error),
      };
    }
  },

  /**
   * Resend verification email
   */
  resendVerificationEmail: async (email) => {
    try {
      const response = await api.post("/auth/resend-verification-email", {
        email,
      });
      return {
        success: true,
        message: response.message,
      };
    } catch (error) {
      return {
        success: false,
        error: handleApiError(error),
      };
    }
  },

  /**
   * Promote user to admin (admin only)
   */
  promoteToAdmin: async (userId) => {
    try {
      const response = await api.post(`/auth/${userId}/promote-admin`);
      return {
        success: true,
        user: response.user,
      };
    } catch (error) {
      return {
        success: false,
        error: handleApiError(error),
      };
    }
  },

  /**
   * Demote user from admin (super-admin only)
   */
  demoteFromAdmin: async (userId) => {
    try {
      const response = await api.post(`/auth/${userId}/demote-admin`);
      return {
        success: true,
        user: response.user,
      };
    } catch (error) {
      return {
        success: false,
        error: handleApiError(error),
      };
    }
  },
};

export default authService;
