import axios from 'axios';
import { ENV } from '../config/env';
import { store } from '../store';
import { logout } from '../store/authSlice';
import { persistor } from '../store';
import { showError } from '../store/errorSlice';
import { Vibration } from 'react-native';

import en from '../localization/en';
import hi from '../localization/hi';

const translations = { en, hi };

const instance = axios.create({
  baseURL: ENV.API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

let isLoggingOut = false;

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

instance.interceptors.response.use(
  response => response,
  async error => {
    const dispatch = store.dispatch;
    const state = store.getState();
    const currentLang = state.language.currentLang;

    const t = translations[currentLang];

    const status = error?.response?.status;
    const code = error?.code;

    // 🔐 SESSION EXPIRED
    if (status === 401 && !isLoggingOut) {
      isLoggingOut = true;

      Vibration.vibrate([0, 200, 100, 200]);

      dispatch(
        showError({
          message: t.errors.sessionExpired,
          type: 'warning',
        })
      );

      dispatch(logout());
      await persistor.purge();

      setTimeout(() => {
        isLoggingOut = false;
      }, 1000);

      return Promise.reject(error);
    }

    // ⏱️ TIMEOUT
    if (code === 'ECONNABORTED') {
      Vibration.vibrate([0, 200, 100, 200]);

      dispatch(
        showError({
          message: t.errors.timeout,
        })
      );

      return Promise.reject(error);
    }

    // 🌐 NO INTERNET
    if (!error.response) {
      Vibration.vibrate([0, 200, 100, 200]);

      dispatch(
        showError({
          message: t.errors.noInternet,
        })
      );

      return Promise.reject(error);
    }

    // 🔴 Backend error message
    if (error.response?.data?.message) {
      dispatch(
        showError({
          message: error.response.data.message,
        })
      );
    }

    return Promise.reject(error);
  },
);

export default instance;