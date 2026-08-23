import { z } from 'zod';

export const registerSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(2, 'First name must contain at least 2 characters.')
    .max(100, 'First name cannot exceed 100 characters.'),

  lastName: z.string().trim().max(100, 'Last name cannot exceed 100 characters.').optional(),

  email: z
    .string()
    .trim()
    .toLowerCase()
    .email('Invalid email address.')
    .max(320, 'Email cannot exceed 320 characters.'),

  password: z
    .string()
    .min(8, 'Password must contain at least 8 characters.')
    .max(128, 'Password cannot exceed 128 characters.'),
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email('Invalid email address.').max(320),
  password: z.string().min(1, 'Password is required.').max(128),
});

export const verifyEmailOtpSchema = z.object({
  email: z.string().trim().toLowerCase().email('Invalid email address.').max(320),
  otp: z
    .string()
    .trim()
    .regex(/^\d{6}$/, 'OTP must be a 6-digit code.'),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

export const resendOtpSchema = z.object({
  email: z.string().trim().toLowerCase().email('Invalid email address').max(320),
});

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .email('Invalid email address.')
    .transform((email) => email.toLowerCase()),
});

export const resetPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .email('Invalid email address.')
    .transform((email) => email.toLowerCase()),

  otp: z
    .string()
    .trim()
    .regex(/^\d{6}$/, 'OTP must contain 6 digits.'),

  newPassword: z
    .string()
    .min(8, 'Password must contain at least 8 characters.')
    .max(128, 'Password cannot exceed 128 characters.'),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required.'),

    newPassword: z
      .string()
      .min(8, 'Password must contain at least 8 characters.')
      .max(128, 'Password cannot exceed 128 characters.'),
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: 'New password must be different from the current password.',
    path: ['newPassword'],
  });

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResendOtpInput = z.infer<typeof resendOtpSchema>;
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type VerifyEmailOtpInput = z.infer<typeof verifyEmailOtpSchema>;
