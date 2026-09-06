import { prisma } from '@studyhub/database';
import type {
  AdminCreateUserInput,
  AdminListUsersQuery,
  AdminUpdateUserInput,
} from './admin-user.schema';

export const findAllUsersAdmin = async (query: AdminListUsersQuery) => {
  const { page, limit, search, status, roleId, sortBy, sortOrder } = query;
  const skip = (page - 1) * limit;

  const where = {
    ...(search
      ? {
          OR: [
            { email: { contains: search, mode: 'insensitive' as const } },
            { firstName: { contains: search, mode: 'insensitive' as const } },
            { lastName: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {}),
    ...(status ? { status } : {}),
    ...(roleId ? { roleId } : {}),
  };

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        status: true,
        emailVerifiedAt: true,
        avatarUrl: true,
        createdAt: true,
        updatedAt: true,
        role: {
          select: {
            id: true,
            name: true,
            type: true,
          },
        },
        _count: {
          select: {
            sessions: {
              where: { status: 'ACTIVE' },
            },
          },
        },
      },
      orderBy: { [sortBy]: sortOrder },
      skip,
      take: limit,
    }),
    prisma.user.count({ where }),
  ]);

  return {
    users,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNext: page * limit < total,
      hasPrev: page > 1,
    },
  };
};

export const findUserByIdAdmin = async (userId: string) => {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      status: true,
      emailVerifiedAt: true,
      avatarUrl: true,
      createdAt: true,
      updatedAt: true,
      role: {
        select: {
          id: true,
          name: true,
          type: true,
        },
      },
      _count: {
        select: {
          sessions: { where: { status: 'ACTIVE' } },
          otpVerifications: true,
        },
      },
    },
  });
};

export const updateUserByAdmin = async (
  userId: string,
  data: AdminUpdateUserInput & { passwordHash?: string },
) => {
  return prisma.user.update({
    where: { id: userId },
    data: {
      ...(data.roleId ? { roleId: data.roleId } : {}),
      ...(data.status ? { status: data.status } : {}),
      ...(data.firstName !== undefined ? { firstName: data.firstName } : {}),
      ...(data.lastName !== undefined ? { lastName: data.lastName } : {}),
      ...(data.email ? { email: data.email } : {}),
      ...(data.passwordHash ? { passwordHash: data.passwordHash } : {}),
    },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      status: true,
      emailVerifiedAt: true,
      avatarUrl: true,
      createdAt: true,
      updatedAt: true,
      role: {
        select: {
          id: true,
          name: true,
          type: true,
        },
      },
    },
  });
};

export const softDeleteUser = async (userId: string): Promise<void> => {
  await prisma.$transaction([
    prisma.user.update({
      where: { id: userId },
      data: { status: 'DELETED' },
    }),
    // Revoke all active sessions
    prisma.session.updateMany({
      where: { userId, status: 'ACTIVE' },
      data: { status: 'REVOKED', revokedAt: new Date() },
    }),
    // Revoke all refresh tokens
    prisma.refreshToken.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    }),
  ]);
};

export const getAdminStats = async () => {
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const [
    totalUsers,
    activeUsers,
    newUsersThisWeek,
    newUsersThisMonth,
    totalRoles,
    activeSessions,
    suspendedUsers,
    verifiedUsers,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { status: 'ACTIVE' } }),
    prisma.user.count({ where: { createdAt: { gte: weekAgo } } }),
    prisma.user.count({ where: { createdAt: { gte: monthAgo } } }),
    prisma.role.count(),
    prisma.session.count({ where: { status: 'ACTIVE', expiresAt: { gt: now } } }),
    prisma.user.count({ where: { status: 'SUSPENDED' } }),
    prisma.user.count({ where: { emailVerifiedAt: { not: null } } }),
  ]);

  return {
    users: {
      total: totalUsers,
      active: activeUsers,
      suspended: suspendedUsers,
      verified: verifiedUsers,
      newThisWeek: newUsersThisWeek,
      newThisMonth: newUsersThisMonth,
    },
    roles: {
      total: totalRoles,
    },
    sessions: {
      active: activeSessions,
    },
  };
};

export const findUserByEmailAdmin = async (email: string) => {
  return prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });
};

export const createUserByAdmin = async (data: AdminCreateUserInput & { passwordHash: string }) => {
  return prisma.user.create({
    data: {
      email: data.email,
      passwordHash: data.passwordHash,
      firstName: data.firstName,
      lastName: data.lastName,
      roleId: data.roleId,
      status: data.status,
    },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      status: true,
      emailVerifiedAt: true,
      avatarUrl: true,
      createdAt: true,
      updatedAt: true,
      role: {
        select: {
          id: true,
          name: true,
          type: true,
        },
      },
    },
  });
};

export const updateUserAvatarAdmin = async (userId: string, avatarUrl: string | null) => {
  return prisma.user.update({
    where: { id: userId },
    data: { avatarUrl },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      status: true,
      emailVerifiedAt: true,
      avatarUrl: true,
      createdAt: true,
      updatedAt: true,
      role: {
        select: {
          id: true,
          name: true,
          type: true,
        },
      },
    },
  });
};

export const findUserSessionsAdmin = async (userId: string) => {
  return prisma.session.findMany({
    where: { userId },
    select: {
      id: true,
      status: true,
      ipAddress: true,
      userAgent: true,
      lastActiveAt: true,
      expiresAt: true,
      createdAt: true,
    },
    orderBy: { lastActiveAt: 'desc' },
  });
};

export const revokeAllUserSessionsAdmin = async (userId: string): Promise<void> => {
  await prisma.$transaction([
    prisma.session.updateMany({
      where: { userId, status: 'ACTIVE' },
      data: { status: 'REVOKED', revokedAt: new Date() },
    }),
    prisma.refreshToken.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    }),
  ]);
};
