import { redis, withRedisTimeout } from '@/infrastructure/redis/redis.client';

const PERMISSION_CACHE_TTL_SECONDS = 300;
const getPermissionCacheKey = (roleId: string): string => `rbac:role:${roleId}:permissions`;

export const getCachedRolePermissions = async (roleId: string): Promise<string[] | null> => {
  const key = getPermissionCacheKey(roleId);
  const cached = await withRedisTimeout(redis.get(key));

  if (cached === null) {
    return null;
  }

  try {
    const permissions: unknown = JSON.parse(cached);

    if (
      !Array.isArray(permissions) ||
      !permissions.every((permission): permission is string => typeof permission === 'string')
    ) {
      await withRedisTimeout(redis.del(key));
      return null;
    }

    return permissions;
  } catch {
    await withRedisTimeout(redis.del(key));
    return null;
  }
};

export const setCachedRolePermissions = async (
  roleId: string,
  permissions: string[],
): Promise<void> => {
  const key = getPermissionCacheKey(roleId);

  await withRedisTimeout(
    redis.set(key, JSON.stringify(permissions), 'EX', PERMISSION_CACHE_TTL_SECONDS),
  );
};

export const invalidateRolePermissionCache = async (roleId: string): Promise<void> => {
  await withRedisTimeout(redis.del(getPermissionCacheKey(roleId)));
};
