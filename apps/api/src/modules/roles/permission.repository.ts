import { prisma } from '@studyhub/database';

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
