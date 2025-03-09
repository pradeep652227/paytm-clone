import axios from 'axios';
import config from './config';

export default axios.create({
    baseURL: config.backend_base_url,
    withCredentials: true
});

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