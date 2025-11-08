import apiClient from '../config/api';

const authService = {
  signup: async (payload) => {
    // payload: { name, email, password }
    const response = await apiClient
      .post('/user/signup', payload)
      .catch((e) => {
        throw e;
      });
    return response;
  },

  login: async (payload) => {
    // payload: { email, password }
    const response = await apiClient.post('/user/login', payload).catch((e) => {
      throw e;
    });

    return response;
  }
};

export default authService;
