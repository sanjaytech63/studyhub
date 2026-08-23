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

export const assignPermissionToRole = async (
  roleId: string,
  permissionId: string,
): Promise<void> => {
  await prisma.rolePermission.upsert({
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
  const result = await prisma.rolePermission.deleteMany({
    where: {
      roleId,
      permissionId,
    },
  });

  if (result.count === 0) {
    return;
  }
};

export const findAllPermissions = async () => {
  return prisma.permission.findMany({
    select: {
      id: true,
      name: true,
      description: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: {
      name: 'asc',
    },
  });
};

export const replacePermissionsForRole = async (
  roleId: string,
  permissionIds: string[],
): Promise<void> => {
  await prisma.$transaction(async (tx) => {
    const permissionCount = await tx.permission.count({
      where: {
        id: {
          in: permissionIds,
        },
      },
    });

    if (permissionCount !== permissionIds.length) {
      throw new Error('One or more permissions do not exist.');
    }

    await tx.rolePermission.deleteMany({
      where: {
        roleId,
      },
    });

    if (permissionIds.length === 0) {
      return;
    }

    await tx.rolePermission.createMany({
      data: permissionIds.map((permissionId) => ({
        roleId,
        permissionId,
      })),
      skipDuplicates: true,
    });
  });
};
