import apiClient from '../config/api';

const courseService = {
  // Get all courses with optional filters
  getAllCourses: async (params = {}) => {
    try {
      const response = await apiClient.get('/course', { params });
      console.log('API Response - Full:', response);
      console.log('API Response - Courses:', response.data?.courses);

      // Log first course image for debugging
      if (response.data?.courses?.[0]) {
        console.log('First course image URL:', response.data.courses[0].image);
      }

      return response.data?.courses || [];
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get courses by category
  getCoursesByCategory: async (category) => {
    try {
      const response = await apiClient.get('/course', {
        params: { category }
      });
      return response.data?.courses || [];
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Search courses
  searchCourses: async (query) => {
    try {
      const response = await apiClient.get('/course/search', {
        params: { q: query }
      });
      return response.data?.courses || [];
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get single course details
  getCourseById: async (courseId) => {
    try {
      const response = await apiClient.get(`/course/${courseId}`);
      return response.data?.course || null;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get all categories
  getCategories: async () => {
    try {
      // Return empty array for now - backend doesn't have categories endpoint yet
      // You can add this endpoint to backend or extract from courses
      return [];
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default courseService;
