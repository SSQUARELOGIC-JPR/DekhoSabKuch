import axios from 'axios';
import { ENV } from '../config/env';
import { store } from '../store';
import { showError } from '../store/errorSlice';
import { openSessionExpired } from '../store/sessionSlice';
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

let isSessionHandling = false;

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
    const t = translations[currentLang] || translations.en;

    const status = error?.response?.status;

    // ===============================
    // 🔐 401 SESSION EXPIRED
    // ===============================
    if (status === 401 && !isSessionHandling) {
      isSessionHandling = true;

      Vibration.vibrate([0, 200, 100, 200]);

      dispatch(openSessionExpired());

      // prevent multiple triggers
      setTimeout(() => {
        isSessionHandling = false;
      }, 1000);

      return Promise.reject(error);
    }

    // ===============================
    // 🌐 CONNECTION ISSUE
    // ===============================
    if (!error.response) {
      Vibration.vibrate([0, 200, 100, 200]);

      dispatch(
        showError({
          message:
            t?.errors?.connectionIssue ||
            'Unable to connect. Please check your internet connection.',
        })
      );

      return Promise.reject(error);
    }

    // ===============================
    // 🔴 BACKEND ERROR
    // ===============================
    if (error.response?.data?.message) {
      dispatch(
        showError({
          message: error.response.data.message,
        })
      );

      return Promise.reject(error);
    }

    // ===============================
    // 🔥 FALLBACK
    // ===============================
    dispatch(
      showError({
        message:
          t?.errors?.somethingWrong ||
          'Something went wrong.',
      })
    );

    return Promise.reject(error);
  },
);

export default instance;