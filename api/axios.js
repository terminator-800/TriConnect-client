import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  /** Sends cookies (e.g. JWT in httpOnly cookie) on cross-origin requests when the API allows credentials. */
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
