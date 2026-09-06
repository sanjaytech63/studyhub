export const adminRoleKeys = {
  all: ['admin', 'roles'] as const,
  lists: () => [...adminRoleKeys.all, 'list'] as const,
  detail: (id: string) => [...adminRoleKeys.all, 'detail', id] as const,
  permissions: (roleId: string) => [...adminRoleKeys.all, 'permissions', roleId] as const,
  allPermissions: ['admin', 'permissions'] as const,
};
