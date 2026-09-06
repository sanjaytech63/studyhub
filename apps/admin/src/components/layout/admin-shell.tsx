'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { AdminSidebar } from './admin-sidebar';
import { AdminTopbar } from './admin-topbar';
import { useAuthStore } from '@/store/auth.store';
import { getMe } from '@/services/auth.service';
import { getAccessToken } from '@/lib/api/api-client';
import { Loader2 } from 'lucide-react';

export interface AdminShellProps {
  readonly children: React.ReactNode;
}

export function AdminShell({ children }: AdminShellProps) {
  const router = useRouter();
  const { user, setUser, isInitialized, initialize } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    initialize();
  }, [initialize]);

  React.useEffect(() => {
    if (!isInitialized) return;

    const token = getAccessToken();
    if (!token) {
      router.replace('/login');
      return;
    }

    if (!user) {
      getMe()
        .then((userData) => {
          setUser({
            id: userData.id,
            email: userData.email,
            firstName: userData.firstName,
            lastName: userData.lastName,
            avatarUrl: userData.avatarUrl,
            roleId: userData.role?.id,
            role: userData.role,
          });
          setIsLoading(false);
        })
        .catch(() => {
          router.replace('/login');
        });
    } else {
      setIsLoading(false);
    }
  }, [isInitialized, user, router, setUser]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-background text-muted-foreground">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-xs font-mono tracking-wider uppercase text-muted-foreground/80">
            Initializing Admin Plane...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground antialiased selection:bg-primary/20 selection:text-primary-foreground">
      {/* Sidebar Navigation */}
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex flex-col lg:pl-64 min-h-screen">
        <AdminTopbar onOpenSidebar={() => setSidebarOpen(true)} />

        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto animate-in fade-in duration-200">
          {children}
        </main>
      </div>
    </div>
  );
}
