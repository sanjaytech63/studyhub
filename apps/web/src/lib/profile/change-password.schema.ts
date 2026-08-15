import { z } from 'zod';

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required.'),

    newPassword: z
      .string()
      .min(8, 'New password must contain at least 8 characters.')
      .max(128, 'New password cannot exceed 128 characters.')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d])/,
        'Password must contain uppercase, lowercase, number, and special character.',
      ),

    confirmPassword: z.string().min(1, 'Please confirm your new password.'),
  })
  .superRefine((values, context) => {
    if (values.newPassword !== values.confirmPassword) {
      context.addIssue({
        code: 'custom',
        message: 'Passwords do not match.',
        path: ['confirmPassword'],
      });
    }

    if (values.currentPassword === values.newPassword) {
      context.addIssue({
        code: 'custom',
        message: 'New password must be different from your current password.',
        path: ['newPassword'],
      });
    }
  });

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;
