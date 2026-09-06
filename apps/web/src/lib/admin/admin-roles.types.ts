export interface Permission {
  readonly id: string;
  readonly name: string;
  readonly description?: string | null;
  readonly createdAt?: string;
  readonly updatedAt?: string;
}

export interface Role {
  readonly id: string;
  readonly name: string;
  readonly description?: string | null;
  readonly type: 'SYSTEM' | 'CUSTOM';
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly rolePermissions?: readonly {
    readonly permission: Permission;
  }[];
}

export interface CreateRolePayload {
  readonly name: string;
  readonly description?: string;
  readonly permissionIds?: readonly string[];
}

export interface UpdateRolePayload {
  readonly name?: string;
  readonly description?: string;
}

export interface RolePermissionsResponse {
  readonly roleId: string;
  readonly permissions: readonly Permission[];
}

export interface AssignRolePermissionPayload {
  readonly permissionId: string;
}

export interface ReplaceRolePermissionsPayload {
  readonly permissionIds: readonly string[];
}
