import { useMutation } from '@tanstack/react-query';

import {
  forgotPassword,
  login,
  logout,
  register,
  resendOtp,
  resetPassword,
  verifyOtp,
} from '@/services/auth/auth.service';

import type {
  AuthResponse,
  ForgotPasswordPayload,
  RegisterPayload,
  ResetPasswordResponse,
  VerifyOtpPayload,
  VerifyOtpResponse,
} from './auth.types';

import type { LoginFormValues } from './auth.schemas';
import { authKeys } from './auth.keys';
import { useAuthStore } from '@/store/auth.store';

export function useLoginMutation() {
  return useMutation<AuthResponse, Error, LoginFormValues>({
    mutationKey: authKeys.login(),
    mutationFn: login,
  });
}

export function useRegisterMutation() {
  return useMutation<AuthResponse, Error, RegisterPayload>({
    mutationKey: authKeys.register(),
    mutationFn: register,
  });
}

export function useVerifyOtpMutation() {
  return useMutation<VerifyOtpResponse, Error, VerifyOtpPayload>({
    mutationKey: authKeys.verifyOtp(),
    mutationFn: verifyOtp,
  });
}

export function useResendOtpMutation() {
  return useMutation<void, Error, string>({
    mutationKey: authKeys.resendOtp(),
    mutationFn: resendOtp,
  });
}

export function useForgotPasswordMutation() {
  return useMutation<void, Error, ForgotPasswordPayload>({
    mutationKey: authKeys.forgotPassword(),
    mutationFn: forgotPassword,
  });
}

export function useResetPasswordMutation() {
  return useMutation<
    ResetPasswordResponse,
    Error,
    {
      token: string;
      password: string;
    }
  >({
    mutationKey: authKeys.resetPassword(),
    mutationFn: resetPassword,
  });
}

export function useLogoutMutation() {
  const clearAuth = useAuthStore((state) => state.clearAuth);
  return useMutation<void, Error, void>({
    mutationFn: logout,
    onSettled: () => {
      clearAuth();
    },
  });
}
