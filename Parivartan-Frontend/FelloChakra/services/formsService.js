import api, { handleApiError } from "./api";

/**
 * Forms and Applications service for form-related operations
 */

export const formsService = {
  /**
   * Get all available forms
   */
  getForms: async () => {
    try {
      const response = await api.get("/forms");
      return {
        success: true,
        forms: response,
      };
    } catch (error) {
      return {
        success: false,
        error: handleApiError(error),
      };
    }
  },

  /**
   * Get form details with questions
   */
  getFormById: async (formId) => {
    try {
      const response = await api.get(`/forms/${formId}`);
      return {
        success: true,
        form: response.form,
        questions: response.questions,
      };
    } catch (error) {
      return {
        success: false,
        error: handleApiError(error),
      };
    }
  },

  /**
   * Create a new form (admin only)
   */
  createForm: async (title, description = "") => {
    try {
      const response = await api.post("/forms", { title, description });
      return {
        success: true,
        form: response.form,
      };
    } catch (error) {
      return {
        success: false,
        error: handleApiError(error),
      };
    }
  },

  /**
   * Add question to form (admin only)
   */
  addQuestion: async (formId, question) => {
    try {
      const response = await api.post(`/forms/${formId}/questions`, question);
      return {
        success: true,
        question: response.question,
      };
    } catch (error) {
      return {
        success: false,
        error: handleApiError(error),
      };
    }
  },

  /**
   * Publish form (admin only)
   */
  publishForm: async (formId) => {
    try {
      const response = await api.put(`/forms/${formId}/publish`);
      return {
        success: true,
        form: response.form,
      };
    } catch (error) {
      return {
        success: false,
        error: handleApiError(error),
      };
    }
  },

  /**
   * Delete form (admin only)
   */
  deleteForm: async (formId) => {
    try {
      await api.delete(`/forms/${formId}`);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: handleApiError(error),
      };
    }
  },
};

export const applicationsService = {
  /**
   * Submit application form
   */
  submitApplication: async (formId, answers) => {
    try {
      const response = await api.post("/applications/submit", {
        form_id: formId,
        answers,
      });
      return {
        success: true,
        application: response.application,
        is_rejected: response.is_rejected,
        rejection_reason: response.rejection_reason,
      };
    } catch (error) {
      return {
        success: false,
        error: handleApiError(error),
      };
    }
  },

  /**
   * Get user's applications
   */
  getUserApplications: async () => {
    try {
      const response = await api.get("/applications/my-applications");
      return {
        success: true,
        applications: response,
      };
    } catch (error) {
      return {
        success: false,
        error: handleApiError(error),
      };
    }
  },

  /**
   * Get applications for a form (admin only)
   */
  getApplicationsByForm: async (formId) => {
    try {
      const response = await api.get(`/applications/form/${formId}`);
      return {
        success: true,
        applications: response,
      };
    } catch (error) {
      return {
        success: false,
        error: handleApiError(error),
      };
    }
  },

  /**
   * Get statistics for form submissions (admin only)
   */
  getApplicationStats: async (formId) => {
    try {
      const response = await api.get(`/applications/form/${formId}/stats`);
      return {
        success: true,
        stats: response,
      };
    } catch (error) {
      return {
        success: false,
        error: handleApiError(error),
      };
    }
  },

  /**
   * Get application details
   */
  getApplicationById: async (applicationId) => {
    try {
      const response = await api.get(`/applications/${applicationId}`);
      return {
        success: true,
        application: response,
      };
    } catch (error) {
      return {
        success: false,
        error: handleApiError(error),
      };
    }
  },
};

export default { formsService, applicationsService };
