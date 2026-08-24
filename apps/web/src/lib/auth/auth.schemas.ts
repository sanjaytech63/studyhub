import { z } from 'zod';

/**
 * ============================================================================
 * PASSWORD
 * ============================================================================
 *
 * Shared password validation used by:
 * - Register
 * - Reset password
 * - Change password
 */

const passwordSchema = z
  .string()
  .min(8, 'Password must contain at least 8 characters.')
  .max(128, 'Password cannot exceed 128 characters.')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter.')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter.')
  .regex(/\d/, 'Password must contain at least one number.')
  .regex(/[^A-Za-z\d]/, 'Password must contain at least one special character.');

/**
 * ============================================================================
 * LOGIN
 * ============================================================================
 *
 * POST /auth/login
 */

export const loginSchema = z.object({
  email: z.string().trim().email('Please enter a valid email address.'),

  password: z.string().min(1, 'Password is required.'),
});

/**
 * ============================================================================
 * REGISTER
 * ============================================================================
 *
 * POST /auth/register
 *
 * Backend expects:
 * - firstName
 * - lastName
 * - email
 * - password
 */

export const registerSchema = z
  .object({
    firstName: z
      .string()
      .trim()
      .min(2, 'First name must contain at least 2 characters.')
      .max(100, 'First name cannot exceed 100 characters.'),

    lastName: z.string().trim().max(100, 'Last name cannot exceed 100 characters.').optional(),

    email: z.string().trim().email('Please enter a valid email address.'),

    password: passwordSchema,

    confirmPassword: z.string().min(1, 'Please confirm your password.'),

    terms: z.boolean().refine((value) => value, 'You must accept the terms and conditions.'),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  });

/**
 * ============================================================================
 * VERIFY EMAIL OTP
 * ============================================================================
 *
 * POST /auth/verify-otp
 */

export const verifyOtpSchema = z.object({
  otp: z
    .string()
    .trim()
    .regex(/^\d{6}$/, 'Enter the 6-digit verification code.'),
});

/**
 * ============================================================================
 * RESEND EMAIL OTP
 * ============================================================================
 *
 * POST /auth/resend-otp
 */

export const resendOtpSchema = z.object({
  email: z.string().trim().email('Please enter a valid email address.'),
});

/**
 * ============================================================================
 * FORGOT PASSWORD
 * ============================================================================
 *
 * POST /auth/forgot-password
 */

export const forgotPasswordSchema = z.object({
  email: z.string().trim().email('Please enter a valid email address.'),
});

/**
 * ============================================================================
 * RESET PASSWORD
 * ============================================================================
 *
 * POST /auth/reset-password
 *
 * Backend flow:
 *
 * email
 * otp
 * password
 *
 * confirmPassword is frontend-only validation
 * and is NOT sent to the backend.
 */

export const resetPasswordSchema = z
  .object({
    email: z.string().trim().email('Please enter a valid email address.'),

    otp: z
      .string()
      .trim()
      .regex(/^\d{6}$/, 'Enter the 6-digit password reset OTP.'),

    password: passwordSchema,

    confirmPassword: z.string().min(1, 'Please confirm your password.'),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  });

/**
 * ============================================================================
 * CHANGE PASSWORD
 * ============================================================================
 *
 * POST /auth/change-password
 *
 * Backend expects:
 * - currentPassword
 * - newPassword
 *
 * confirmPassword is frontend-only validation.
 */

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required.'),

    newPassword: passwordSchema,

    confirmPassword: z.string().min(1, 'Please confirm your new password.'),
  })
  .refine((values) => values.newPassword === values.confirmPassword, {
    message: 'New passwords do not match.',
    path: ['confirmPassword'],
  });

/**
 * ============================================================================
 * FORM VALUE TYPES
 * ============================================================================
 */

export type LoginFormValues = z.infer<typeof loginSchema>;

export type RegisterFormValues = z.infer<typeof registerSchema>;

export type VerifyOtpFormValues = z.infer<typeof verifyOtpSchema>;

export type ResendOtpFormValues = z.infer<typeof resendOtpSchema>;

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;
