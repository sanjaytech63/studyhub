import type { ReactNode } from 'react';

import { DashboardShell } from '@/components/dashboard/dashboard-shell';

interface DashboardLayoutProps {
  readonly children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return <DashboardShell>{children}</DashboardShell>;
}
