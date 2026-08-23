import { prisma } from '@studyhub/database';

export const findPermissionsByRoleId = async (roleId: string) => {
  return prisma.rolePermission.findMany({
    where: {
      roleId,
    },
    select: {
      permission: {
        select: {
          name: true,
        },
      },
    },
  });
};
