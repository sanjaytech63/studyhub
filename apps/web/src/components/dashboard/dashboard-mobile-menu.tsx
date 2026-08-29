'use client';

import * as React from 'react';

interface DashboardSidebarContextValue {
  isMobileOpen: boolean;
  isCollapsed: boolean;
  openMobileSidebar: () => void;
  closeMobileSidebar: () => void;
  toggleMobileSidebar: () => void;
  toggleCollapsed: () => void;
}

const DashboardSidebarContext = React.createContext<DashboardSidebarContextValue | null>(null);

export function DashboardSidebarProvider({ children }: { readonly children: React.ReactNode }) {
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  const openMobileSidebar = React.useCallback(() => setIsMobileOpen(true), []);
  const closeMobileSidebar = React.useCallback(() => setIsMobileOpen(false), []);
  const toggleMobileSidebar = React.useCallback(() => setIsMobileOpen((prev) => !prev), []);
  const toggleCollapsed = React.useCallback(() => setIsCollapsed((prev) => !prev), []);

  // Prevent background scrolling when mobile menu drawer is open
  React.useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileOpen]);

  const value = React.useMemo(
    () => ({
      isMobileOpen,
      isCollapsed,
      openMobileSidebar,
      closeMobileSidebar,
      toggleMobileSidebar,
      toggleCollapsed,
    }),
    [
      isMobileOpen,
      isCollapsed,
      openMobileSidebar,
      closeMobileSidebar,
      toggleMobileSidebar,
      toggleCollapsed,
    ],
  );

  return (
    <DashboardSidebarContext.Provider value={value}>{children}</DashboardSidebarContext.Provider>
  );
}

/**
 * Custom hook to access dashboard sidebar state and controls.
 */
export function useDashboardSidebar() {
  const context = React.useContext(DashboardSidebarContext);
  if (!context) {
    throw new Error('useDashboardSidebar must be used within a DashboardSidebarProvider');
  }
  return context;
}
