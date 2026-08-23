import { z } from 'zod';

export const updateMeSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, 'First name is required.')
    .max(100, 'First name cannot exceed 100 characters.'),

  lastName: z
    .string()
    .trim()
    .max(100, 'Last name cannot exceed 100 characters.')
    .nullable()
    .optional(),
});

export const changeEmailSchema = z.object({
  newEmail: z
    .string()
    .trim()
    .email('Invalid email address.')
    .transform((email) => email.toLowerCase()),
});

export const verifyEmailChangeSchema = z.object({
  otp: z
    .string()
    .trim()
    .regex(/^\d{6}$/, 'OTP must be 6 digits.'),
});
export const resendEmailChangeOtpSchema = z.object({
  newEmail: z
    .string()
    .trim()
    .email('Invalid email address.')
    .transform((email) => email.toLowerCase()),
});

export type ResendEmailChangeOtpInput = z.infer<typeof resendEmailChangeOtpSchema>;
export type VerifyEmailChangeInput = z.infer<typeof verifyEmailChangeSchema>;
export type ChangeEmailInput = z.infer<typeof changeEmailSchema>;
export type UpdateMeInput = z.infer<typeof updateMeSchema>;
