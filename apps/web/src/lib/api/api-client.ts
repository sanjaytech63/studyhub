import axios from 'axios';
import { useAuthStore } from '@/store/auth.store';
import { normalizeApiError } from './api-error';
import { apiConfig } from './api-config';

export const apiClient = axios.create({
  baseURL: apiConfig.baseURL,
  timeout: apiConfig.timeout,

  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },

  withCredentials: true,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(normalizeApiError(error)),
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const normalizedError = normalizeApiError(error);
    if (normalizedError.statusCode === 401) {
      useAuthStore.getState().clearAuth();
    }
    return Promise.reject(normalizedError);
  },
);
