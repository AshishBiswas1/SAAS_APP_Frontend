import apiClient from '../config/api';

const reviewService = {
  getMyReviews: async () => {
    try {
      const response = await apiClient.get('/review/myreviews');
      return response?.data?.reviews || response?.data || [];
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  updateReview: async (reviewId, payload) => {
    try {
      const response = await apiClient.patch(`/review/${reviewId}`, payload);
      return response?.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  deleteReview: async (reviewId) => {
    try {
      const response = await apiClient.delete(`/review/${reviewId}`);
      return response?.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default reviewService;
