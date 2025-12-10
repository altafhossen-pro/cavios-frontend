import axios from 'axios';

// Auto-detect backend URL based on frontend URL
const getApiBaseUrl = () => {
  // If explicitly set via environment variable, use that
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }

  // If running in browser, check if we're on ngrok
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    const protocol = window.location.protocol;
    
    // If frontend is on ngrok, backend should also be on ngrok
    if (hostname.includes('ngrok') || hostname.includes('ngrok-free')) {
      // Frontend is on ngrok, so backend should also be on ngrok
      // Replace frontend ngrok URL with backend ngrok URL
      // You need to run backend through ngrok on port 5000
      // Example: If frontend is https://abc123.ngrok-free.dev
      //          Backend should be https://xyz789.ngrok-free.dev (different ngrok URL for port 5000)
      console.warn('Frontend is on ngrok. Backend should also be on ngrok. Set NEXT_PUBLIC_API_URL environment variable with your backend ngrok URL.');
      // Return localhost - this will cause CORS if backend is not on ngrok
      return 'http://localhost:5000/api/v1';
    }
  }

  // Default: localhost for local development
  return 'http://localhost:5000/api/v1';
};

// API Base URL
const API_BASE_URL = getApiBaseUrl();

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for cookies
});

// Request interceptor - Add auth token if available
apiClient.interceptors.request.use(
  (config) => {
    // Get token from cookies if available
    if (typeof document !== 'undefined') {
      const cookies = document.cookie.split(';');
      const tokenCookie = cookies.find((cookie) => cookie.trim().startsWith('token='));
      if (tokenCookie) {
        const token = tokenCookie.split('=')[1];
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common errors
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      if (typeof document !== 'undefined') {
        document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        // window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;

