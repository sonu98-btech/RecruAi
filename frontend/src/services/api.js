import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5001/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// For Super Admins acting on a specific company, they can set X-Company-Id
api.interceptors.request.use((config) => {
  const selectedCompanyId = localStorage.getItem('selectedCompanyId');
  if (selectedCompanyId) {
    config.headers['X-Company-Id'] = selectedCompanyId;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
