import {
  apiClient,
  setAccessToken,
  setRefreshToken,
  setSessionId,
  clearAuthTokens,
} from '@/lib/api/api-client';

export interface LoginPayload {
  readonly email: string;
  readonly password: string;
}

export interface AuthResponse {
  readonly accessToken: string;
  readonly refreshToken: string;
  readonly sessionId: string;
  readonly user: {
    readonly id: string;
    readonly email: string;
    readonly firstName: string;
    readonly lastName?: string | null;
    readonly avatarUrl?: string | null;
    readonly roleId: string;
  };
}

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  const response = await apiClient.post<{ success: boolean; data: AuthResponse }>(
    '/auth/login',
    payload,
  );
  const data = response.data.data;
  setAccessToken(data.accessToken);
  setRefreshToken(data.refreshToken);
  setSessionId(data.sessionId);
  return data;
}

export async function logout(): Promise<{ message: string }> {
  try {
    const response = await apiClient.post<{
      success: boolean;
      message?: string;
      data?: { message?: string };
    }>('/auth/logout');
    const msg =
      response.data?.message ||
      response.data?.data?.message ||
      'You have been signed out successfully.';
    return { message: msg };
  } finally {
    clearAuthTokens();
  }
}

export interface MeResponse {
  readonly id: string;
  readonly email: string;
  readonly firstName: string;
  readonly lastName?: string | null;
  readonly avatarUrl?: string | null;
  readonly status: string;
  readonly emailVerifiedAt?: string | null;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly role: {
    readonly id: string;
    readonly name: string;
  };
}

export async function getMe(): Promise<MeResponse> {
  const response = await apiClient.get<{ success: boolean; data: { user: MeResponse } }>('/me');
  return response.data.data.user;
}
