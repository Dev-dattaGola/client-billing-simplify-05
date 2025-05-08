
import axios from 'axios';

// Create an Axios instance with default config
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token and role information
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('userData');
    
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    // Add user role and firmId to headers if available
    if (userData) {
      try {
        const { role, firmId, id } = JSON.parse(userData);
        config.headers['X-User-Role'] = role;
        if (firmId) {
          config.headers['X-Firm-ID'] = firmId;
        }
        config.headers['X-User-ID'] = id;
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling common errors
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle specific error cases
    if (error.response) {
      // Server responded with a status code outside 2xx range
      if (error.response.status === 401) {
        // Auth error, redirect to login
        localStorage.removeItem('auth_token');
        localStorage.removeItem('userData');
        localStorage.removeItem('isAuthenticated');
        
        // Redirect to login if not already there
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
      
      if (error.response.status === 403) {
        // Permission denied
        console.error('Permission denied:', error.response.data);
      }
    } else if (error.request) {
      // Network error or no response received
      console.error('Network error:', error.request);
    } else {
      // Request error
      console.error('Request error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
