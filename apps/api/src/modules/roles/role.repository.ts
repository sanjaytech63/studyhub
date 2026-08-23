import { AppError } from '@/errors/app-error';
import { ERROR_CODES } from '@/errors/error-codes';
import { HTTP_STATUS } from '@/utils/http-status';
import { prisma } from '@studyhub/database';

export interface CreateRoleWithPermissionsData {
  name: string;
  description: string;
  permissionIds: string[];
}

export const findAllRoles = async () => {
  return prisma.role.findMany({
    select: {
      id: true,
      name: true,
      description: true,
      type: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: {
      name: 'asc',
    },
  });
};

export const findRoleById = async (roleId: string) => {
  return prisma.role.findUnique({
    where: {
      id: roleId,
    },
    select: {
      id: true,
      name: true,
      description: true,
      type: true,
    },
  });
};

export interface CreateRoleData {
  name: string;
  description: string;
}

export const createRoleWithPermissions = async (data: CreateRoleWithPermissionsData) => {
  return prisma.$transaction(async (tx) => {
    const permissionCount = await tx.permission.count({
      where: {
        id: {
          in: data.permissionIds,
        },
      },
    });

    if (permissionCount !== data.permissionIds.length) {
      throw new AppError(
        HTTP_STATUS.BAD_REQUEST,
        ERROR_CODES.INVALID_REQUEST,
        'One or more permissions do not exist.',
      );
    }

    const role = await tx.role.create({
      data: {
        name: data.name,
        description: data.description,
        type: 'CUSTOM',
      },
      select: {
        id: true,
        name: true,
        description: true,
        type: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (data.permissionIds.length > 0) {
      await tx.rolePermission.createMany({
        data: data.permissionIds.map((permissionId) => ({
          roleId: role.id,
          permissionId,
        })),
        skipDuplicates: true,
      });
    }

    return role;
  });
};

export interface UpdateRoleData {
  name?: string;
  description?: string;
}

export const updateRole = async (roleId: string, data: UpdateRoleData) => {
  return prisma.role.update({
    where: {
      id: roleId,
    },
    data,
    select: {
      id: true,
      name: true,
      description: true,
      type: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

export const deleteRole = async (roleId: string): Promise<void> => {
  await prisma.$transaction(async (tx) => {
    await tx.rolePermission.deleteMany({
      where: {
        roleId,
      },
    });

    await tx.role.delete({
      where: {
        id: roleId,
      },
    });
  });
};

export const countUsersByRoleId = async (roleId: string): Promise<number> => {
  return prisma.user.count({
    where: {
      roleId,
    },
  });
};
