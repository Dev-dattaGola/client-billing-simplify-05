import axios from 'axios';

// Update API base URL to point to backend
const API_BASE_URL = import.meta.env.PROD 
  ? '/api' // In production, backend serves frontend
  : 'http://localhost:5000/api'; // In development, separate servers

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add the JWT token to the headers
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;
