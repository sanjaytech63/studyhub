'use client';

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

interface MobileNavigationContextValue {
  isMoreOpen: boolean;
  openMore: () => void;
  closeMore: () => void;
}

const MobileNavigationContext = createContext<MobileNavigationContextValue | null>(null);

interface MobileNavigationProviderProps {
  children: ReactNode;
}

export function MobileNavigationProvider({ children }: MobileNavigationProviderProps) {
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  const openMore = useCallback(() => {
    setIsMoreOpen(true);
  }, []);

  const closeMore = useCallback(() => {
    setIsMoreOpen(false);
  }, []);

  const value = useMemo(
    () => ({
      isMoreOpen,
      openMore,
      closeMore,
    }),
    [isMoreOpen, openMore, closeMore],
  );

  return (
    <MobileNavigationContext.Provider value={value}>{children}</MobileNavigationContext.Provider>
  );
}

export function useMobileNavigation() {
  const context = useContext(MobileNavigationContext);

  if (!context) {
    throw new Error('useMobileNavigation must be used inside MobileNavigationProvider');
  }

  return context;
}
