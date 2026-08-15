'use client';

import { create } from 'zustand';

interface AuthState {
  readonly isAuthenticated: boolean;
  setAuthenticated: (value: boolean) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,

  setAuthenticated: (value) => {
    set({
      isAuthenticated: value,
    });
  },

  clearAuth: () => {
    set({
      isAuthenticated: false,
    });
  },
}));
