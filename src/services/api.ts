import axios, { AxiosInstance } from 'axios';

// Base API URL can be overridden via environment variables
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.intervai.dev/v1';

export const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 15000,
});

// Request Interceptor (e.g. Auth Tokens)
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('intervai_auth_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor (Handling Global Errors)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.warn('API Response Warning/Error:', error.message || error);
    return Promise.reject(error);
  }
);
