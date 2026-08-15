'use client';

import type { ReactNode } from 'react';

import { DashboardHeader } from './dashboard-header';
import { DashboardSidebar } from './dashboard-sidebar';
import { DashboardSidebarProvider } from './dashboard-mobile-menu';

interface DashboardShellProps {
  readonly children: ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
  return (
    <DashboardSidebarProvider>
      <div className="min-h-svh bg-background">
        <DashboardSidebar />

        <div className="min-w-0 lg:pl-64 md:pl-48">
          <DashboardHeader />

          <main className="min-h-[calc(100svh-4rem)]">
            <div className="mx-auto w-full max-w-360 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </DashboardSidebarProvider>
  );
}
