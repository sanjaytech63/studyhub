import type { RequestHandler } from 'express';

import { HTTP_STATUS } from '@/utils/http-status';
import { AppError } from '@/errors/app-error';
import { ERROR_CODES } from '@/errors/error-codes';
import {
  getCachedRolePermissions,
  setCachedRolePermissions,
} from '@/modules/roles/role-permission.cache';
import { logger } from '@/config/logger';
import { findPermissionsByRoleId } from '@/modules/roles/role-permission.repository';

export const requireRole = (...allowedRoleIds: string[]): RequestHandler => {
  return (req, _res, next) => {
    if (!req.user) {
      throw new AppError(
        HTTP_STATUS.UNAUTHORIZED,
        ERROR_CODES.UNAUTHORIZED,
        'Authentication required.',
      );
    }

    if (!allowedRoleIds.includes(req.user.roleId)) {
      throw new AppError(
        HTTP_STATUS.FORBIDDEN,
        ERROR_CODES.FORBIDDEN,
        'You do not have permission to access this resource.',
      );
    }

    next();
  };
};

export const requirePermission = (permission: string): RequestHandler => {
  return async (req, _res, next) => {
    if (!req.user) {
      throw new AppError(
        HTTP_STATUS.UNAUTHORIZED,
        ERROR_CODES.UNAUTHORIZED,
        'Authentication required.',
      );
    }

    const { roleId } = req.user;

    let permissions: string[] | null = null;

    // -------------------------------------------------------------------------
    // 1. Try Redis cache
    // -------------------------------------------------------------------------

    try {
      permissions = await getCachedRolePermissions(roleId);
    } catch (error) {
      logger.warn(
        {
          error,
          roleId,
          permission,
        },
        'RBAC Redis cache lookup failed; falling back to database',
      );
    }

    // -------------------------------------------------------------------------
    // 2. Cache HIT
    // -------------------------------------------------------------------------

    if (permissions !== null) {
      if (!permissions.includes(permission)) {
        throw new AppError(
          HTTP_STATUS.FORBIDDEN,
          ERROR_CODES.FORBIDDEN,
          'You do not have permission to access this resource.',
        );
      }

      next();
      return;
    }

    // -------------------------------------------------------------------------
    // 3. Cache MISS / Redis unavailable -> PostgreSQL
    // -------------------------------------------------------------------------

    const permissionRecords = await findPermissionsByRoleId(roleId);

    permissions = permissionRecords.map(
      ({ permission: currentPermission }) => currentPermission.name,
    );

    // -------------------------------------------------------------------------
    // 4. Best-effort Redis cache population
    // -------------------------------------------------------------------------

    try {
      await setCachedRolePermissions(roleId, permissions);
    } catch (error) {
      logger.warn(
        {
          error,
          roleId,
        },
        'RBAC Redis cache population failed',
      );
    }

    // -------------------------------------------------------------------------
    // 5. Authorization decision
    // -------------------------------------------------------------------------

    if (!permissions.includes(permission)) {
      throw new AppError(
        HTTP_STATUS.FORBIDDEN,
        ERROR_CODES.FORBIDDEN,
        'You do not have permission to access this resource.',
      );
    }

    next();
  };
};
