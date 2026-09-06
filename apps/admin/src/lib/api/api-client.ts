import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api/v1';

const ACCESS_TOKEN_KEY = 'studyhub_admin_access_token';
const REFRESH_TOKEN_KEY = 'studyhub_admin_refresh_token';
const SESSION_ID_KEY = 'studyhub_admin_session_id';

interface RetryableConfig extends InternalAxiosRequestConfig {
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

function isBrowser() {
  return typeof window !== 'undefined';
}

function writeStorage(key: string, value: string | null): void {
  if (!isBrowser()) return;
  if (value === null) {
    localStorage.removeItem(key);
    return;
  }
  localStorage.setItem(key, value);
}

export function setAccessToken(token: string | null) {
  accessToken = token;
  writeStorage(ACCESS_TOKEN_KEY, token);
}
export function getAccessToken() {
  return accessToken;
}
export function clearAccessToken() {
  accessToken = null;
  writeStorage(ACCESS_TOKEN_KEY, null);
}

export function setRefreshToken(token: string | null) {
  refreshToken = token;
  writeStorage(REFRESH_TOKEN_KEY, token);
}
export function getRefreshToken() {
  return refreshToken;
}
export function clearRefreshToken() {
  refreshToken = null;
  writeStorage(REFRESH_TOKEN_KEY, null);
}

export function setSessionId(value: string | null) {
  sessionId = value;
  writeStorage(SESSION_ID_KEY, value);
}
export function getSessionId() {
  return sessionId;
}
export function clearSessionId() {
  sessionId = null;
  writeStorage(SESSION_ID_KEY, null);
}

export function initializeAuthState(): void {
  if (!isBrowser()) return;
  accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
  refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
  sessionId = localStorage.getItem(SESSION_ID_KEY);
}

export function clearAuthTokens(): void {
  clearAccessToken();
  clearRefreshToken();
  clearSessionId();
}

export const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
  withCredentials: true,
});

// Request interceptor — attach access token
apiClient.interceptors.request.use(
  (config) => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(normalizeError(error)),
);

const AUTH_ROUTES = ['/auth/login', '/auth/refresh', '/auth/register'];

function isAuthRoute(url?: string) {
  if (!url) return false;
  return AUTH_ROUTES.some((r) => url.includes(r));
}

async function refreshAccessToken(): Promise<string> {
  const currentRefreshToken = getRefreshToken();
  if (!currentRefreshToken) throw new Error('No refresh token.');

  if (!refreshPromise) {
    refreshPromise = axios
      .post<{ success: boolean; data: RefreshResponse }>(
        `${API_URL}/auth/refresh`,
        { refreshToken: currentRefreshToken },
        { withCredentials: true, timeout: 15000, headers: { 'Content-Type': 'application/json' } },
      )
      .then((res) => {
        const data = res.data.data;
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

// Response interceptor — auto-refresh on 401
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as RetryableConfig | undefined;

    if (error.response?.status !== 401 || !original) {
      return Promise.reject(normalizeError(error));
    }

    if (isAuthRoute(original.url)) {
      return Promise.reject(normalizeError(error));
    }

    if (original._retry) {
      clearAuthTokens();
      if (isBrowser()) window.location.href = '/login';
      return Promise.reject(normalizeError(error));
    }

    original._retry = true;

    try {
      const newToken = await refreshAccessToken();
      original.headers.Authorization = `Bearer ${newToken}`;
      return apiClient.request(original);
    } catch {
      clearAuthTokens();
      if (isBrowser()) window.location.href = '/login';
      return Promise.reject(normalizeError(error));
    }
  },
);

export interface ApiError {
  readonly message: string;
  readonly code?: string;
  readonly status?: number;
  readonly errors?: unknown;
}

export function normalizeError(error: unknown): ApiError {
  if (axios.isAxiosError(error)) {
    if (!error.response) {
      return {
        message:
          'Unable to connect to API server (http://localhost:5000). Please ensure the backend API is running (npm run dev:api).',
        code: error.code,
      };
    }
    const data = error.response?.data as Record<string, unknown> | undefined;
    return {
      message: (data?.message as string) ?? error.message ?? 'An unexpected error occurred.',
      code: (data?.code as string) ?? undefined,
      status: error.response?.status,
      errors: data?.errors,
    };
  }
  if (error instanceof Error) {
    return { message: error.message };
  }
  return { message: 'An unexpected error occurred.' };
}
