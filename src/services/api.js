import axios from 'axios';

const API = axios.create({
  baseURL: 'https://pharma-ecommerce.onrender.com/api',
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;