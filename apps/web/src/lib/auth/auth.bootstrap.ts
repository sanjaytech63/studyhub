import {
  clearAuthTokens,
  getAccessToken,
  getRefreshToken,
  initializeAuthState,
} from '@/lib/api/api-client';
import { refreshSession } from '@/services/auth/auth.service';
import { getProfile } from '@/services/profile/profile.service';

import { useAuthStore } from '@/store/auth.store';

import type { AuthUser } from './auth.types';
import type { Profile } from '@/lib/profile/profile.types';

let bootstrapPromise: Promise<void> | null = null;

function profileToAuthUser(profile: Profile): AuthUser {
  return {
    id: profile.id,
    email: profile.email,
    firstName: profile.firstName,
    lastName: profile.lastName,
    roleId: profile.role.id,
  };
}

export async function bootstrapAuth(): Promise<void> {
  if (bootstrapPromise) {
    return bootstrapPromise;
  }

  bootstrapPromise = bootstrapAuthInternal().finally(() => {
    bootstrapPromise = null;
  });

  return bootstrapPromise;
}

async function bootstrapAuthInternal(): Promise<void> {
  initializeAuthState();

  const store = useAuthStore.getState();

  const accessToken = getAccessToken();

  const refreshToken = getRefreshToken();

  if (!accessToken && !refreshToken) {
    store.clearAuth();
    return;
  }

  try {
    /*
     * If access token exists,
     * /me will automatically refresh
     * if the access token is expired.
     */
    if (accessToken) {
      const profile = await getProfile();

      store.setAuthenticated(profileToAuthUser(profile));

      return;
    }

    /*
     * No access token but refresh token
     * is available.
     */
    if (refreshToken) {
      await refreshSession();

      const profile = await getProfile();

      store.setAuthenticated(profileToAuthUser(profile));

      return;
    }

    store.clearAuth();
  } catch {
    clearAuthTokens();

    store.clearAuth();
  }
}
