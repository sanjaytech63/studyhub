import { create } from 'zustand';

import type { AuthUser } from '@/lib/auth/auth.types';

interface AuthState {
  readonly user: AuthUser | null;
  readonly isAuthenticated: boolean;
  readonly isInitialized: boolean;

  setAuthenticated: (user: AuthUser) => void;
  updateUser: (patch: Partial<AuthUser>) => void;
  clearAuth: () => void;
  setInitialized: (value: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isInitialized: false,

  setAuthenticated: (user) =>
    set({
      user,
      isAuthenticated: true,
      isInitialized: true,
    }),

  updateUser: (patch) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...patch } : null,
    })),

  clearAuth: () =>
    set({
      user: null,
      isAuthenticated: false,
      isInitialized: true,
    }),

  setInitialized: (value) =>
    set({
      isInitialized: value,
    }),
}));
