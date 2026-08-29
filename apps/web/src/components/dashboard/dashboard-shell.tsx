'use client';

import type { ReactNode } from 'react';

import { DashboardHeader } from './dashboard-header';
import { DashboardSidebar } from './dashboard-sidebar';
import { DashboardSidebarProvider, useDashboardSidebar } from './dashboard-mobile-menu';
import { cn } from '@/lib/utils';

interface DashboardShellProps {
  readonly children: ReactNode;
}

function InnerShell({ children }: DashboardShellProps) {
  const { isCollapsed } = useDashboardSidebar();

  return (
    <div className="min-h-svh bg-background font-sans antialiased selection:bg-primary/20">
      <DashboardSidebar />

      {/* Dynamic Main Content Offset based on Collapsed State */}
      <div
        className={cn(
          'flex flex-col min-h-svh min-w-0 transition-all duration-300 ease-in-out',
          isCollapsed ? 'md:pl-20' : 'md:pl-64',
        )}
      >
        <DashboardHeader />

        <main className="flex-1">
          <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export function DashboardShell({ children }: DashboardShellProps) {
  return (
    <DashboardSidebarProvider>
      <InnerShell>{children}</InnerShell>
    </DashboardSidebarProvider>
  );
}
