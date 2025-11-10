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
      // apiClient may unwrap response.data already — handle both shapes
      // possible shapes:
      // 1) { status, data: { course } }
      // 2) { course }
      // 3) { data: course }
      return (
        response?.data?.course || response?.course || response?.data || null
      );
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get reviews for a specific course
  getCourseReviews: async (courseId) => {
    try {
      const response = await apiClient.get(`/review/course/${courseId}`);
      // apiClient may return either the raw Axios response or the response body
      // Handle both shapes: (1) { data: { reviews: [...] } } or (2) { status, results, data: { reviews } }
      return (
        response?.data?.reviews || // if apiClient returned body under response.data
        response?.data?.data?.reviews || // legacy shape
        response?.data || // if apiClient returned { data: [...] }
        response?.reviews || // fallback
        []
      );
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Create a review for a course (requires auth)
  createReview: async ({ course_id, rating, review }) => {
    try {
      const response = await apiClient.post('/review', {
        course_id,
        rating,
        review
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get courses created by the logged-in user
  getMyCourses: async () => {
    try {
      const response = await apiClient.get('/course/my-courses');
      return (
        response?.data?.courses || response?.courses || response?.data || []
      );
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Create a course (multipart/form-data)
  createCourse: async (formData) => {
    try {
      const response = await apiClient.post('/course/postCourse', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response?.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  publishCourse: async (courseId) => {
    try {
      const response = await apiClient.patch(`/course/${courseId}/publish`);
      return response?.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  updateCourse: async (courseId, payload) => {
    try {
      // If payload is FormData (for file uploads), set multipart header
      const config = {};
      if (typeof FormData !== 'undefined' && payload instanceof FormData) {
        config.headers = { 'Content-Type': 'multipart/form-data' };
      }
      const response = await apiClient.patch(
        `/course/${courseId}`,
        payload,
        config
      );
      return response?.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Author-specific update (for course owners). Supports FormData.
  updateMyCourse: async (courseId, payload) => {
    try {
      const config = {};
      if (typeof FormData !== 'undefined' && payload instanceof FormData) {
        config.headers = { 'Content-Type': 'multipart/form-data' };
      }
      const response = await apiClient.patch(
        `/course/${courseId}/update`,
        payload,
        config
      );
      return response?.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  unpublishCourse: async (courseId) => {
    try {
      const response = await apiClient.patch(`/course/${courseId}/unpublish`);
      return response?.data;
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
