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
  },
  getMe: async () => {
    // Check if authToken exists in localStorage
    const token = localStorage.getItem('authToken');

    if (!token) {
      console.log(
        'No auth token found in localStorage, skipping getMe request'
      );
      return null;
    }

    // Calls backend route which reads token from Authorization header
    // { status: 'success', data: { user: { ... } } } or user=null.
    try {
      const resp = await apiClient.get('/user/getMe');
      // apiClient interceptor unwraps response -> resp is the body
      const userRow = resp?.data?.user || resp?.user || resp?.data || null;
      if (!userRow) return null;
      const userObj = {
        id: userRow.id,
        email: userRow.email || userRow.email,
        name: userRow.full_name || userRow.name || userRow.email || '',
        image: userRow.image || null,
        raw: userRow
      };
      return userObj;
    } catch (e) {
      return null;
    }
  }
  // No server-side logout: client will clear cookie/local state
};

export default authService;
