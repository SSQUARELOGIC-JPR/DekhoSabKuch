import axios from 'axios';
import { ENV } from '../config/env';
import { store } from '../store';

const instance = axios.create({
  baseURL: ENV.API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 🔐 Attach JWT token automatically
instance.interceptors.request.use(
  config => {
    const state = store.getState();
    const token = state.auth.token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  error => Promise.reject(error),
);

export default instance;