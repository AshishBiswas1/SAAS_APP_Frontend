import apiClient from '../config/api';

const paymentService = {
  // Check if user is enrolled in a course
  checkEnrollment: async (courseId) => {
    try {
      const response = await apiClient.get(
        `/payment/check-enrollment/${courseId}`
      );
      return response?.data || response || { isEnrolled: false };
    } catch (error) {
      // If user is not authenticated, return not enrolled
      if (error.response?.status === 401) {
        return { isEnrolled: false };
      }
      throw error.response?.data || error.message;
    }
  },

  // Create checkout session
  createCheckoutSession: async (courseId) => {
    try {
      const response = await apiClient.get(
        `/payment/checkout-session/${courseId}`
      );
      return response?.data || response;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Verify payment after checkout
  verifyPayment: async (sessionId) => {
    try {
      const response = await apiClient.post('/payment/verify-payment', {
        session_id: sessionId
      });
      return response?.data || response;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get user's payment history
  getMyPayments: async () => {
    try {
      const response = await apiClient.get('/payment/my-payments');
      return response?.data?.payments || response?.payments || [];
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default paymentService;
