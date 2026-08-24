'use client';

import type { ReactNode } from 'react';

import { ThemeProvider as NextThemesProvider } from '@teispace/next-themes';

interface ThemeProviderProps {
  readonly children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      storage="hybrid"
    >
      {children}
    </NextThemesProvider>
  );
}
