import axios from 'axios';
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

apiClient.interceptors.response.use(
  (response) => response,

  (error) => {
    return Promise.reject(normalizeApiError(error));
  },
);
