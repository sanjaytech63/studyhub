import { z } from 'zod';

export const roleIdParamSchema = z.object({
  roleId: z.uuid('Invalid role ID.'),
});

export const permissionIdParamSchema = z.object({
  roleId: z.uuid('Invalid role ID.'),
  permissionId: z.uuid('Invalid permission ID.'),
});

export const assignPermissionSchema = z.object({
  permissionId: z.uuid('Invalid permission ID.'),
});

export type RoleIdParam = z.infer<typeof roleIdParamSchema>;
export type PermissionIdParam = z.infer<typeof permissionIdParamSchema>;
export type AssignPermissionInput = z.infer<typeof assignPermissionSchema>;
