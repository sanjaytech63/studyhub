export const authKeys = {
  all: ['auth'] as const,
  login: () => [...authKeys.all, 'login'] as const,
  register: () => [...authKeys.all, 'register'] as const,
  verifyOtp: () => [...authKeys.all, 'verify-otp'] as const,
  resendOtp: () => [...authKeys.all, 'resend-otp'] as const,
  forgotPassword: () => [...authKeys.all, 'forgot-password'] as const,
  resetPassword: () => [...authKeys.all, 'reset-password'] as const,
};
