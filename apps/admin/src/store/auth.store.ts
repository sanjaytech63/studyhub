import { create } from 'zustand';
import { initializeAuthState, clearAuthTokens } from '@/lib/api/api-client';

interface AdminUser {
  readonly id: string;
  readonly email: string;
  readonly firstName: string;
  readonly lastName?: string | null;
  readonly avatarUrl?: string | null;
  readonly roleId?: string;
  readonly role?: {
    readonly id: string;
    readonly name: string;
  };
}

interface AuthState {
  user: AdminUser | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
  setUser: (user: AdminUser | null) => void;
  logout: () => void;
  initialize: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isInitialized: false,

  setUser: (user) => {
    set({ user, isAuthenticated: user !== null });
  },

  logout: () => {
    clearAuthTokens();
    set({ user: null, isAuthenticated: false });
  },

  initialize: () => {
    initializeAuthState();
    set({ isInitialized: true });
  },
}));
