import { z } from 'zod';

export const adminProfileSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, 'First name is required.')
    .max(100, 'First name cannot exceed 100 characters.'),
  lastName: z
    .string()
    .trim()
    .max(100, 'Last name cannot exceed 100 characters.')
    .optional()
    .or(z.literal('')),
});

export type AdminProfileFormValues = z.infer<typeof adminProfileSchema>;

export const adminChangePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required.'),
    newPassword: z
      .string()
      .min(8, 'New password must be at least 8 characters long.')
      .max(128, 'New password cannot exceed 128 characters.'),
    confirmPassword: z.string().min(1, 'Please confirm your new password.'),
  })
  .superRefine((data, ctx) => {
    if (data.newPassword !== data.confirmPassword) {
      ctx.addIssue({
        code: 'custom',
        message: 'Passwords do not match.',
        path: ['confirmPassword'],
      });
    }
    if (data.currentPassword && data.newPassword && data.currentPassword === data.newPassword) {
      ctx.addIssue({
        code: 'custom',
        message: 'New password must be different from your current password.',
        path: ['newPassword'],
      });
    }
  });

export type AdminChangePasswordFormValues = z.infer<typeof adminChangePasswordSchema>;

export const adminChangeEmailSchema = z.object({
  newEmail: z
    .string()
    .trim()
    .min(1, 'New email address is required.')
    .email('Please enter a valid email address.')
    .transform((val) => val.toLowerCase()),
});

export type AdminChangeEmailFormValues = z.infer<typeof adminChangeEmailSchema>;

export const adminVerifyEmailOtpSchema = z.object({
  otp: z
    .string()
    .trim()
    .length(6, 'Verification code must be 6 digits.')
    .regex(/^\d{6}$/, 'Verification code must only contain numbers.'),
});

export type AdminVerifyEmailOtpFormValues = z.infer<typeof adminVerifyEmailOtpSchema>;
