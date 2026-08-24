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
  ResetPasswordPayload,
  ResetPasswordResponse,
  VerifyOtpPayload,
  VerifyOtpResponse,
} from './auth.types';

import type { LoginFormValues } from './auth.schemas';

import { authKeys } from './auth.keys';

import { useAuthStore } from '@/store/auth.store';

/**
 * ============================================================================
 * Login
 * ============================================================================
 */

export function useLoginMutation() {
  const setAuthenticated = useAuthStore((state) => state.setAuthenticated);

  return useMutation<AuthResponse, Error, LoginFormValues>({
    mutationKey: authKeys.login(),

    mutationFn: login,

    onSuccess: (response) => {
      const user = response.user;

      setAuthenticated({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        roleId: user.roleId,
      });
    },
  });
}

/**
 * ============================================================================
 * Register
 * ============================================================================
 */

export function useRegisterMutation() {
  return useMutation<AuthResponse, Error, RegisterPayload>({
    mutationKey: authKeys.register(),
    mutationFn: register,
  });
}

/**
 * ============================================================================
 * Verify OTP
 * ============================================================================
 */

export function useVerifyOtpMutation() {
  return useMutation<VerifyOtpResponse, Error, VerifyOtpPayload>({
    mutationKey: authKeys.verifyOtp(),
    mutationFn: verifyOtp,
  });
}

/**
 * ============================================================================
 * Resend OTP
 * ============================================================================
 */

export function useResendOtpMutation() {
  return useMutation<void, Error, string>({
    mutationKey: authKeys.resendOtp(),
    mutationFn: resendOtp,
  });
}

/**
 * ============================================================================
 * Forgot Password
 * ============================================================================
 */

export function useForgotPasswordMutation() {
  return useMutation<void, Error, ForgotPasswordPayload>({
    mutationKey: authKeys.forgotPassword(),
    mutationFn: forgotPassword,
  });
}

/**
 * ============================================================================
 * Reset Password
 * ============================================================================
 */

export function useResetPasswordMutation() {
  return useMutation<ResetPasswordResponse, Error, ResetPasswordPayload>({
    mutationKey: authKeys.resetPassword(),
    mutationFn: resetPassword,
  });
}

/**
 * ============================================================================
 * Logout
 * ============================================================================
 */

export function useLogoutMutation() {
  const clearAuth = useAuthStore((state) => state.clearAuth);
  return useMutation<void, Error, void>({
    mutationKey: authKeys.logout(),
    mutationFn: logout,
    onSettled: () => {
      clearAuth();
    },
  });
}
