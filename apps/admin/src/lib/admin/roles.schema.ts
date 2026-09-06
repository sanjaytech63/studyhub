import { z } from 'zod';

export const createRoleFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Role name is required.')
    .max(50, 'Role name cannot exceed 50 characters.')
    .regex(
      /^[A-Z0-9_]+$/,
      'Role name must be UPPERCASE letters, numbers, and underscores (e.g. MODERATOR).',
    ),
  description: z
    .string()
    .trim()
    .max(255, 'Description cannot exceed 255 characters.')
    .optional()
    .or(z.literal('')),
  permissionIds: z.array(z.string()),
});

export type CreateRoleFormValues = z.infer<typeof createRoleFormSchema>;

export const updateRoleFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Role name is required.')
    .max(50, 'Role name cannot exceed 50 characters.')
    .regex(
      /^[A-Z0-9_]+$/,
      'Role name must be UPPERCASE letters, numbers, and underscores (e.g. MODERATOR).',
    ),
  description: z
    .string()
    .trim()
    .max(255, 'Description cannot exceed 255 characters.')
    .optional()
    .or(z.literal('')),
});

export type UpdateRoleFormValues = z.infer<typeof updateRoleFormSchema>;
