import { AppError } from '@/errors/app-error';
import { ERROR_CODES } from '@/errors/error-codes';
import { HTTP_STATUS } from '@/utils/http-status';
import { hashPassword } from '@/modules/auth/auth.password';
import { findRoleById } from '@/modules/roles/role.repository';
import type {
  AdminCreateUserInput,
  AdminListUsersQuery,
  AdminUpdateUserInput,
} from './admin-user.schema';
import {
  createUserByAdmin,
  findAllUsersAdmin,
  findUserByEmailAdmin,
  findUserByIdAdmin,
  findUserSessionsAdmin,
  getAdminStats,
  revokeAllUserSessionsAdmin,
  softDeleteUser,
  updateUserAvatarAdmin,
  updateUserByAdmin,
} from './admin-user.repository';
import {
  deleteAvatarByPublicId,
  uploadAvatarStream,
} from '@/infrastructure/cloudinary/cloudinary.client';

export const listUsers = async (query: AdminListUsersQuery) => {
  return findAllUsersAdmin(query);
};

export const getUserById = async (userId: string) => {
  const user = await findUserByIdAdmin(userId);

  if (!user) {
    throw new AppError(HTTP_STATUS.NOT_FOUND, ERROR_CODES.RESOURCE_NOT_FOUND, 'User not found.');
  }

  return user;
};

export const updateUser = async (userId: string, input: AdminUpdateUserInput) => {
  const user = await findUserByIdAdmin(userId);

  if (!user) {
    throw new AppError(HTTP_STATUS.NOT_FOUND, ERROR_CODES.RESOURCE_NOT_FOUND, 'User not found.');
  }

  if (user.status === 'DELETED') {
    throw new AppError(
      HTTP_STATUS.BAD_REQUEST,
      ERROR_CODES.INVALID_REQUEST,
      'Cannot update a deleted user.',
    );
  }

  if (input.email && input.email !== user.email) {
    const existingUser = await findUserByEmailAdmin(input.email);
    if (existingUser && existingUser.id !== userId) {
      throw new AppError(
        HTTP_STATUS.CONFLICT,
        ERROR_CODES.EMAIL_ALREADY_EXISTS,
        'A user with this email address already exists.',
      );
    }
  }

  let passwordHash: string | undefined;
  if (input.password) {
    passwordHash = await hashPassword(input.password);
  }

  return updateUserByAdmin(userId, {
    ...input,
    passwordHash,
  });
};

export const deleteUser = async (userId: string): Promise<void> => {
  const user = await findUserByIdAdmin(userId);

  if (!user) {
    throw new AppError(HTTP_STATUS.NOT_FOUND, ERROR_CODES.RESOURCE_NOT_FOUND, 'User not found.');
  }

  if (user.status === 'DELETED') {
    throw new AppError(
      HTTP_STATUS.CONFLICT,
      ERROR_CODES.RESOURCE_CONFLICT,
      'User is already deleted.',
    );
  }

  await softDeleteUser(userId);
};

export const getStats = async () => {
  return getAdminStats();
};

export const createUser = async (input: AdminCreateUserInput) => {
  const existingUser = await findUserByEmailAdmin(input.email);
  if (existingUser) {
    throw new AppError(
      HTTP_STATUS.CONFLICT,
      ERROR_CODES.RESOURCE_CONFLICT,
      'A user with this email address already exists.',
    );
  }

  const role = await findRoleById(input.roleId);
  if (!role) {
    throw new AppError(
      HTTP_STATUS.BAD_REQUEST,
      ERROR_CODES.INVALID_REQUEST,
      'The specified role does not exist.',
    );
  }

  const passwordHash = await hashPassword(input.password);
  return createUserByAdmin({
    ...input,
    passwordHash,
  });
};

export const getUserSessions = async (userId: string) => {
  const user = await findUserByIdAdmin(userId);
  if (!user) {
    throw new AppError(HTTP_STATUS.NOT_FOUND, ERROR_CODES.RESOURCE_NOT_FOUND, 'User not found.');
  }

  return findUserSessionsAdmin(userId);
};

export const revokeUserSessions = async (userId: string): Promise<void> => {
  const user = await findUserByIdAdmin(userId);
  if (!user) {
    throw new AppError(HTTP_STATUS.NOT_FOUND, ERROR_CODES.RESOURCE_NOT_FOUND, 'User not found.');
  }

  await revokeAllUserSessionsAdmin(userId);
};

export const uploadUserAvatarAdmin = async (userId: string, fileBuffer: Buffer) => {
  const user = await findUserByIdAdmin(userId);
  if (!user) {
    throw new AppError(HTTP_STATUS.NOT_FOUND, ERROR_CODES.RESOURCE_NOT_FOUND, 'User not found.');
  }

  const { url } = await uploadAvatarStream(fileBuffer, userId);
  return updateUserAvatarAdmin(userId, url);
};

export const removeUserAvatarAdmin = async (userId: string) => {
  const user = await findUserByIdAdmin(userId);
  if (!user) {
    throw new AppError(HTTP_STATUS.NOT_FOUND, ERROR_CODES.RESOURCE_NOT_FOUND, 'User not found.');
  }

  await deleteAvatarByPublicId(`studyhub/avatars/avatar_${userId}`);
  return updateUserAvatarAdmin(userId, null);
};
