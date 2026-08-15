import { apiClient } from '@/lib/api/api-client';

export interface LoginPayload {
  readonly email: string;
  readonly password: string;
}

export interface LoginResponse {
  readonly accessToken: string;
}

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  const response = await apiClient.post<LoginResponse>('/auth/login', payload);
  return response.data;
}

export async function logout(): Promise<void> {
  await apiClient.post('/auth/logout');
}
