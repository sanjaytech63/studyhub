import { z } from 'zod';

const passwordSchema = z
  .string()
  .min(8, 'Password must contain at least 8 characters.')
  .max(128, 'Password cannot exceed 128 characters.')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter.')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter.')
  .regex(/\d/, 'Password must contain at least one number.')
  .regex(/[^A-Za-z\d]/, 'Password must contain at least one special character.');

export const loginSchema = z.object({
  email: z.string().trim().email('Please enter a valid email address.'),

  password: z.string().min(1, 'Password is required.'),
});

export const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, 'Name must contain at least 2 characters.')
      .max(100, 'Name cannot exceed 100 characters.'),

    email: z.string().trim().email('Please enter a valid email address.'),

    password: passwordSchema,

    confirmPassword: z.string().min(1, 'Please confirm your password.'),

    terms: z.boolean().refine((value) => value, 'You must accept the terms and conditions.'),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  });

export const verifyOtpSchema = z.object({
  otp: z
    .string()
    .trim()
    .regex(/^\d{6}$/, 'Enter the 6-digit verification code.'),
});

export const forgotPasswordSchema = z.object({
  email: z.string().trim().email('Please enter a valid email address.'),
});

export const resetPasswordSchema = z
  .object({
    password: passwordSchema,

    confirmPassword: z.string().min(1, 'Please confirm your password.'),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  });

export type LoginFormValues = z.infer<typeof loginSchema>;

export type RegisterFormValues = z.infer<typeof registerSchema>;

export type VerifyOtpFormValues = z.infer<typeof verifyOtpSchema>;

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;
