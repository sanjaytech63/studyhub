'use client';

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface AuthState {
  readonly accessToken: string | null;
  readonly isAuthenticated: boolean;

  setAccessToken: (token: string) => void;
  clearAuth: () => void;
}

const initialState: Pick<AuthState, 'accessToken' | 'isAuthenticated'> = {
  accessToken: null,
  isAuthenticated: false,
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      ...initialState,

      setAccessToken: (token) => {
        const normalizedToken = token.trim();

        if (!normalizedToken) {
          return;
        }

        set({
          accessToken: normalizedToken,
          isAuthenticated: true,
        });
      },

      clearAuth: () => {
        set(initialState);
      },
    }),

    {
      name: 'studyhub-auth',

      storage: createJSONStorage(() => localStorage),

      partialize: (state) => ({
        accessToken: state.accessToken,
      }),
    },
  ),
);
