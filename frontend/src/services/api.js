import axios from 'axios';

const api = axios.create({
  baseURL: 'https://agent-backend-93ja.onrender.com',
});

// Interceptor to add JWT token to requests if available
api.interceptors.request.use(
  (config) => {
    const user = localStorage.getItem('user')
      ? JSON.parse(localStorage.getItem('user'))
      : null;

    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
