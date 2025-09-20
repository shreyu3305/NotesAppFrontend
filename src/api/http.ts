import axios from 'axios';

// Mock axios instance - in real app, this would have a baseURL
const api = axios.create({
  timeout: 5000,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export { api };