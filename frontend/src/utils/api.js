import axios from 'axios';
import config from './config';

console.log("Backend URL:", config.backend_base_url); // Verify correct URL is loaded

const api = axios.create({
  baseURL: config.backend_base_url,
  withCredentials: true
});

// Log request details before sending
api.interceptors.request.use(request => {
  console.log('Request:', request.method, request.baseURL + request.url);
  return request;
});

export default api;
/*

// Optional: Add request interceptor
api.interceptors.request.use((config) => {
  // You can modify config here, add headers, etc.
  return config;
});

// Optional: Add response interceptor for global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Global error handling
    return Promise.reject(error);
  }
);

*/