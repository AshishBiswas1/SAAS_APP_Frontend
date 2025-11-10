import axios from 'axios';
import { showToast } from '../components/toastService';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/saas';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  // include credentials (cookies) so the backend which checks req.cookies.jwt can see the session
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests if it exists
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle response errors
apiClient.interceptors.response.use(
  (response) => {
    const data = response.data;
    // If backend returns an error-like status payload, surface it via toast
    if (
      data &&
      typeof data === 'object' &&
      (data.status === 'fail' || data.status === 'error')
    ) {
      const msg = data.message || data.error || 'Request failed';
      try {
        showToast(msg, 'error');
      } catch (e) {
        // ignore
      }
      return Promise.reject(data);
    }
    return response.data;
  },
  (error) => {
    const resp = error.response;
    if (resp?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    const data = resp?.data;
    const msg =
      data?.message || data?.error || error.message || 'Request failed';
    try {
      showToast(msg, 'error');
    } catch (e) {
      // ignore
    }
    return Promise.reject(error);
  }
);

export default apiClient;
