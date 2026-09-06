import { z } from 'zod';

export const createUserFormSchema = z.object({
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
  email: z
    .string()
    .trim()
    .min(1, 'Email address is required.')
    .email('Please enter a valid email address.'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long.')
    .max(100, 'Password cannot exceed 100 characters.'),
  roleId: z.string().min(1, 'Please select a role.'),
  status: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED']),
});

export type CreateUserFormValues = z.infer<typeof createUserFormSchema>;

export const updateUserFormSchema = z.object({
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
  email: z
    .string()
    .trim()
    .min(1, 'Email address is required.')
    .email('Please enter a valid email address.'),
  password: z
    .string()
    .max(100, 'Password cannot exceed 100 characters.')
    .optional()
    .refine((val) => !val || val.length >= 8, {
      message: 'New password must be at least 8 characters long.',
    }),
  roleId: z.string().min(1, 'Please select a role.'),
  status: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED']),
});

export type UpdateUserFormValues = z.infer<typeof updateUserFormSchema>;
