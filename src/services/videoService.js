import apiClient from '../config/api';

const videoService = {
  getVideosByCourse: async (courseId) => {
    try {
      const resp = await apiClient.get(`/video/course/${courseId}`);
      // resp may be { videos: [...] } under data
      return resp?.data?.videos || resp?.videos || resp?.data || [];
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  uploadVideo: async ({ courseId, file, title, onUploadProgress }) => {
    try {
      const fd = new FormData();
      fd.append('video', file);
      fd.append('in_course', courseId);
      if (title) fd.append('video_title', title);

      const resp = await apiClient.post('/video/upload', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress
      });
      return resp?.data || resp;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default videoService;
