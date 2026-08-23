import { prisma } from '@studyhub/database';

export const assignPermissionToRole = async (roleId: string, permissionId: string) => {
  return prisma.rolePermission.upsert({
    where: {
      roleId_permissionId: {
        roleId,
        permissionId,
      },
    },
    update: {},
    create: {
      roleId,
      permissionId,
    },
  });
};

export const removePermissionFromRole = async (
  roleId: string,
  permissionId: string,
): Promise<void> => {
  await prisma.rolePermission.delete({
    where: {
      roleId_permissionId: {
        roleId,
        permissionId,
      },
    },
  });
};
