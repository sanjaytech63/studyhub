'use client';

import * as React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { AdminSidebar } from './admin-sidebar';
import { AdminTopbar } from './admin-topbar';
import { useAuthStore } from '@/store/auth.store';
import { getMe } from '@/services/auth.service';
import { getAccessToken } from '@/lib/api/api-client';
import { Loader2 } from 'lucide-react';
import { cn } from '../ui/button';

export interface AdminShellProps {
  readonly children: React.ReactNode;
}

export function AdminShell({ children }: AdminShellProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, setUser, isInitialized, initialize } = useAuthStore();
  const [mobileSidebarOpen, setMobileSidebarOpen] = React.useState(false);
  const [desktopSidebarOpen, setDesktopSidebarOpen] = React.useState(true);
  const [isLoading, setIsLoading] = React.useState(!user);

  // Automatically close mobile drawer when navigating
  const [prevPathname, setPrevPathname] = React.useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setMobileSidebarOpen(false);
  }

  const handleToggleSidebar = React.useCallback(() => {
    if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
      setDesktopSidebarOpen((prev) => !prev);
    } else {
      setMobileSidebarOpen((prev) => !prev);
    }
  }, []);

  React.useEffect(() => {
    initialize();
  }, [initialize]);

  React.useEffect(() => {
    if (!isInitialized) return;

    let isMounted = true;
    const verifySession = async () => {
      const token = getAccessToken();
      if (!token) {
        router.replace('/login');
        return;
      }

      if (!user) {
        try {
          const userData = await getMe();
          if (!isMounted) return;
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
        } catch {
          if (isMounted) {
            router.replace('/login');
          }
        }
      } else {
        await Promise.resolve();
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void verifySession();

    return () => {
      isMounted = false;
    };
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
      <AdminSidebar
        isMobileOpen={mobileSidebarOpen}
        isDesktopOpen={desktopSidebarOpen}
        isOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div
        className={cn(
          'flex flex-col min-h-screen transition-all duration-300 ease-in-out',
          desktopSidebarOpen ? 'lg:pl-64' : 'lg:pl-0',
        )}
      >
        <AdminTopbar
          onToggleSidebar={handleToggleSidebar}
          onOpenSidebar={() => setMobileSidebarOpen(true)}
          isSidebarCollapsed={!desktopSidebarOpen}
        />

        <main className="flex-1 p-3.5 sm:p-6 md:p-8 max-w-7xl w-full mx-auto animate-in fade-in duration-200">
          {children}
        </main>
      </div>
    </div>
  );
}
