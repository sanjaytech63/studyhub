import { z } from 'zod';

export const adminListUsersQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().trim().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED', 'DELETED']).optional(),
  roleId: z.uuid('Invalid role ID.').optional(),
  sortBy: z.enum(['createdAt', 'email', 'firstName', 'status']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export const adminUpdateUserSchema = z
  .object({
    roleId: z.uuid('Invalid role ID.').optional(),
    status: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED']).optional(),
    firstName: z.string().trim().min(1).max(100).optional(),
    lastName: z.string().trim().max(100).optional().nullable(),
    email: z.string().trim().email('Invalid email address.').toLowerCase().optional(),
    password: z.string().min(8, 'Password must be at least 8 characters long.').max(100).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided.',
  });

export const adminCreateUserSchema = z.object({
  email: z.string().trim().email('Invalid email address.').toLowerCase(),
  password: z.string().min(8, 'Password must be at least 8 characters long.').max(100),
  firstName: z.string().trim().min(1, 'First name is required.').max(100),
  lastName: z.string().trim().max(100).optional().nullable(),
  roleId: z.uuid('Invalid role ID.'),
  status: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED']).default('ACTIVE'),
});

export const adminUserIdParamSchema = z.object({
  userId: z.uuid('Invalid user ID.'),
});

export type AdminListUsersQuery = z.infer<typeof adminListUsersQuerySchema>;
export type AdminUpdateUserInput = z.infer<typeof adminUpdateUserSchema>;
export type AdminCreateUserInput = z.infer<typeof adminCreateUserSchema>;
