import { z } from 'zod';

export const createRoleSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Role name must contain at least 2 characters.')
    .max(50, 'Role name cannot exceed 50 characters.'),

  description: z
    .string()
    .trim()
    .min(2, 'Role description must contain at least 2 characters.')
    .max(255, 'Role description cannot exceed 255 characters.'),

  permissionIds: z
    .array(z.uuid('Invalid permission ID.'))
    .max(100, 'A role cannot have more than 100 permissions.')
    .default([]),
});

export const updateRoleSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, 'Role name must contain at least 2 characters.')
      .max(50, 'Role name cannot exceed 50 characters.')
      .optional(),

    description: z
      .string()
      .trim()
      .min(2, 'Role description must contain at least 2 characters.')
      .max(255, 'Role description cannot exceed 255 characters.')
      .optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided.',
  });

export type UpdateRoleInput = z.infer<typeof updateRoleSchema>;
export type CreateRoleInput = z.infer<typeof createRoleSchema>;
