import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';

import { normalizeApiError } from './api-error';
import { apiConfig } from './api-config';

const ACCESS_TOKEN_KEY = 'studyhub_access_token';

const REFRESH_TOKEN_KEY = 'studyhub_refresh_token';

const SESSION_ID_KEY = 'studyhub_session_id';

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

interface RefreshResponse {
  readonly accessToken: string;
  readonly refreshToken: string;
}

let accessToken: string | null = null;

let refreshToken: string | null = null;

let sessionId: string | null = null;

let refreshPromise: Promise<string> | null = null;

/* -------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------- */
/* Storage & Cookies                                                          */
/* -------------------------------------------------------------------------- */

function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

function writeCookie(name: string, value: string | null, maxAgeSeconds: number = 604800): void {
  if (!isBrowser()) {
    return;
  }

  if (value === null) {
    document.cookie = `${name}=; path=/; max-age=0; SameSite=Lax`;
  } else {
    document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAgeSeconds}; SameSite=Lax`;
  }
}

function writeStorage(key: string, value: string | null): void {
  if (!isBrowser()) {
    return;
  }

  if (value === null) {
    sessionStorage.removeItem(key);
    localStorage.removeItem(key);
    return;
  }

  sessionStorage.setItem(key, value);
  localStorage.setItem(key, value);
}

function readStorage(key: string): string | null {
  if (!isBrowser()) {
    return null;
  }

  return sessionStorage.getItem(key) || localStorage.getItem(key);
}

/* -------------------------------------------------------------------------- */
/* Access token                                                               */
/* -------------------------------------------------------------------------- */

export function setAccessToken(token: string | null): void {
  accessToken = token;

  writeStorage(ACCESS_TOKEN_KEY, token);
  writeCookie('studyhub_access_token', token);
  if (token) {
    writeCookie('studyhub_session', sessionId || token);
  }
}

export function getAccessToken(): string | null {
  if (!accessToken && isBrowser()) {
    accessToken = readStorage(ACCESS_TOKEN_KEY);
  }

  return accessToken;
}

export function clearAccessToken(): void {
  accessToken = null;

  writeStorage(ACCESS_TOKEN_KEY, null);
  writeCookie('studyhub_access_token', null);
}

/* -------------------------------------------------------------------------- */
/* Refresh token                                                              */
/* -------------------------------------------------------------------------- */

export function setRefreshToken(token: string | null): void {
  refreshToken = token;

  writeStorage(REFRESH_TOKEN_KEY, token);
}

export function getRefreshToken(): string | null {
  if (!refreshToken && isBrowser()) {
    refreshToken = readStorage(REFRESH_TOKEN_KEY);
  }

  return refreshToken;
}

export function clearRefreshToken(): void {
  refreshToken = null;

  writeStorage(REFRESH_TOKEN_KEY, null);
}

/* -------------------------------------------------------------------------- */
/* Session ID                                                                 */
/* -------------------------------------------------------------------------- */

export function setSessionId(value: string | null): void {
  sessionId = value;

  writeStorage(SESSION_ID_KEY, value);
  if (value) {
    writeCookie('studyhub_session', value);
  }
}

export function getSessionId(): string | null {
  if (!sessionId && isBrowser()) {
    sessionId = readStorage(SESSION_ID_KEY);
  }

  return sessionId;
}

export function clearSessionId(): void {
  sessionId = null;

  writeStorage(SESSION_ID_KEY, null);
  writeCookie('studyhub_session', null);
}

/* -------------------------------------------------------------------------- */
/* Initialize auth state                                                      */
/* -------------------------------------------------------------------------- */

export function initializeAuthState(): void {
  if (!isBrowser()) {
    return;
  }

  accessToken = readStorage(ACCESS_TOKEN_KEY);
  refreshToken = readStorage(REFRESH_TOKEN_KEY);
  sessionId = readStorage(SESSION_ID_KEY);

  if (accessToken || sessionId) {
    writeCookie('studyhub_session', sessionId || accessToken || 'active');
    if (accessToken) {
      writeCookie('studyhub_access_token', accessToken);
    }
  }
}

/* -------------------------------------------------------------------------- */
/* Clear everything                                                           */
/* -------------------------------------------------------------------------- */

export function clearAuthTokens(): void {
  clearAccessToken();
  clearRefreshToken();
  clearSessionId();
  writeCookie('studyhub_session', null);
  writeCookie('studyhub_access_token', null);
}

/* -------------------------------------------------------------------------- */
/* API client                                                                 */
/* -------------------------------------------------------------------------- */

export const apiClient = axios.create({
  baseURL: apiConfig.baseURL,

  timeout: apiConfig.timeout,

  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },

  withCredentials: true,
});

/* -------------------------------------------------------------------------- */
/* Request interceptor                                                        */
/* -------------------------------------------------------------------------- */

apiClient.interceptors.request.use(
  (config) => {
    const token = accessToken || getAccessToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },

  (error) => {
    return Promise.reject(normalizeApiError(error));
  },
);

/* -------------------------------------------------------------------------- */
/* Auth routes                                                                */
/* -------------------------------------------------------------------------- */

const AUTH_ROUTES = [
  '/auth/login',
  '/auth/register',
  '/auth/verify-otp',
  '/auth/resend-otp',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/auth/refresh',
];

function isAuthRoute(url?: string): boolean {
  if (!url) {
    return false;
  }

  return AUTH_ROUTES.some((route) => url.includes(route));
}

/* -------------------------------------------------------------------------- */
/* Refresh access token                                                       */
/* -------------------------------------------------------------------------- */

async function refreshAccessToken(): Promise<string> {
  const currentRefreshToken = getRefreshToken();

  if (!currentRefreshToken) {
    throw new Error('Refresh token is missing.');
  }

  if (!refreshPromise) {
    refreshPromise = axios
      .post<{
        success: boolean;
        data: RefreshResponse;
      }>(
        `${apiConfig.baseURL}/auth/refresh`,
        {
          refreshToken: currentRefreshToken,
        },
        {
          withCredentials: true,

          timeout: apiConfig.timeout,

          headers: {
            'Content-Type': 'application/json',

            Accept: 'application/json',
          },
        },
      )
      .then((response) => {
        const data = response.data.data;

        setAccessToken(data.accessToken);

        setRefreshToken(data.refreshToken);

        return data.accessToken;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

/* -------------------------------------------------------------------------- */
/* Response interceptor                                                       */
/* -------------------------------------------------------------------------- */

apiClient.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableRequestConfig | undefined;

    if (error.response?.status !== 401 || !originalRequest) {
      return Promise.reject(normalizeApiError(error));
    }

    if (isAuthRoute(originalRequest.url)) {
      return Promise.reject(normalizeApiError(error));
    }

    if (originalRequest._retry) {
      clearAuthTokens();

      return Promise.reject(normalizeApiError(error));
    }

    originalRequest._retry = true;

    try {
      const newAccessToken = await refreshAccessToken();

      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

      return apiClient.request(originalRequest);
    } catch (refreshError) {
      clearAuthTokens();

      return Promise.reject(normalizeApiError(refreshError));
    }
  },
);
