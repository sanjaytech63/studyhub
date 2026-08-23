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

export type ResendOtpInput = z.infer<typeof resendOtpSchema>;
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type VerifyEmailOtpInput = z.infer<typeof verifyEmailOtpSchema>;
