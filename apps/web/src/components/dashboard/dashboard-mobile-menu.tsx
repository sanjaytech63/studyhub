'use client';

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

interface DashboardSidebarContextValue {
  readonly isMobileOpen: boolean;
  readonly openMobileSidebar: () => void;
  readonly closeMobileSidebar: () => void;
  readonly toggleMobileSidebar: () => void;
}

const DashboardSidebarContext = createContext<DashboardSidebarContextValue | null>(null);

interface DashboardSidebarProviderProps {
  readonly children: ReactNode;
}

export function DashboardSidebarProvider({ children }: DashboardSidebarProviderProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const openMobileSidebar = useCallback(() => {
    setIsMobileOpen(true);
  }, []);

  const closeMobileSidebar = useCallback(() => {
    setIsMobileOpen(false);
  }, []);

  const toggleMobileSidebar = useCallback(() => {
    setIsMobileOpen((current) => !current);
  }, []);

  const value = useMemo(
    () => ({
      isMobileOpen,
      openMobileSidebar,
      closeMobileSidebar,
      toggleMobileSidebar,
    }),
    [isMobileOpen, openMobileSidebar, closeMobileSidebar, toggleMobileSidebar],
  );

  return (
    <DashboardSidebarContext.Provider value={value}>{children}</DashboardSidebarContext.Provider>
  );
}

export function useDashboardSidebar() {
  const context = useContext(DashboardSidebarContext);

  if (!context) {
    throw new Error('useDashboardSidebar must be used within DashboardSidebarProvider');
  }

  return context;
}
