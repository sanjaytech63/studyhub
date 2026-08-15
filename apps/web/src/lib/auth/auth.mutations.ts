'use client';

import { login, logout } from '@/services/auth/auth.service';
import { useAuthStore } from '@/store/auth.store';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface LoginPayload {
  readonly email: string;
  readonly password: string;
}

export function useLoginMutation() {
  const { setAccessToken } = useAuthStore();

  return useMutation({
    mutationKey: ['auth', 'login'],
    mutationFn: (payload: LoginPayload) => login(payload),
    onSuccess: (data) => {
      setAccessToken(data.accessToken);
    },
  });
}

export function useLogoutMutation() {
  const queryClient = useQueryClient();
  const { clearAuth } = useAuthStore();

  return useMutation({
    mutationKey: ['auth', 'logout'],
    mutationFn: logout,
    onSettled: () => {
      clearAuth();
      queryClient.clear();
    },
  });
}
