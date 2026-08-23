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

export const replaceRolePermissionsSchema = z.object({
  permissionIds: z
    .array(z.uuid('Invalid permission ID.'))
    .max(100, 'A role cannot have more than 100 permissions.')
    .refine((permissionIds) => new Set(permissionIds).size === permissionIds.length, {
      message: 'Duplicate permission IDs are not allowed.',
    }),
});

export type ReplaceRolePermissionsInput = z.infer<typeof replaceRolePermissionsSchema>;
export type RoleIdParam = z.infer<typeof roleIdParamSchema>;
export type PermissionIdParam = z.infer<typeof permissionIdParamSchema>;
export type AssignPermissionInput = z.infer<typeof assignPermissionSchema>;
