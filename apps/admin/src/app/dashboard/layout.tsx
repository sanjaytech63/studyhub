import * as React from 'react';
import { AdminShell } from '@/components/layout/admin-shell';

interface DashboardLayoutProps {
  readonly children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return <AdminShell>{children}</AdminShell>;
}
