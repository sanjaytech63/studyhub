'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Users, ShieldAlert, KeyRound, LogOut, Sparkles, X } from 'lucide-react';
import { cn } from '../ui/button';
import { Avatar } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { useAuthStore } from '@/store/auth.store';
import { logout } from '@/services/auth.service';

interface NavItem {
  readonly title: string;
  readonly href: string;
  readonly icon: React.ComponentType<{ className?: string }>;
  readonly badge?: string;
}

interface NavSection {
  readonly title: string;
  readonly items: readonly NavItem[];
}

const NAV_SECTIONS: readonly NavSection[] = [
  {
    title: 'Overview',
    items: [
      {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutDashboard,
      },
    ],
  },
  {
    title: 'Access & RBAC',
    items: [
      {
        title: 'Users Directory',
        href: '/dashboard/users',
        icon: Users,
      },
      {
        title: 'Roles & RBAC',
        href: '/dashboard/roles',
        icon: ShieldAlert,
      },
      {
        title: 'Permissions Matrix',
        href: '/dashboard/permissions',
        icon: KeyRound,
      },
    ],
  },
];

export interface AdminSidebarProps {
  readonly isOpen?: boolean;
  readonly isMobileOpen?: boolean;
  readonly isDesktopOpen?: boolean;
  readonly onClose?: () => void;
}

export function AdminSidebar({
  isOpen,
  isMobileOpen,
  isDesktopOpen = true,
  onClose,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout: storeLogout } = useAuthStore();
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);

  const mobileOpen = isMobileOpen ?? isOpen ?? false;

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } finally {
      storeLogout();
      router.push('/login');
    }
  };

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-xs lg:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-border/80 bg-sidebar/95 backdrop-blur-xl transition-transform duration-300 ease-in-out',
          mobileOpen ? 'translate-x-0' : '-translate-x-full',
          isDesktopOpen ? 'lg:translate-x-0' : 'lg:-translate-x-full',
        )}
      >
        {/* Brand Header */}
        <div className="flex h-16 shrink-0 items-center justify-between px-5 border-b border-border/60">
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="flex h-10 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-primary to-primary-hover shadow-md shadow-primary/25 border border-primary/40 group-hover:scale-105 transition-transform">
              <Sparkles className="h-4.5 w-4.5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-sm tracking-tight text-foreground">
                  StudyHub
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-sm bg-primary/15 text-primary border border-primary/25">
                  ADMIN
                </span>
              </div>
              <p className="text-[10px] text-muted-foreground font-mono">Control Plane v1.0</p>
            </div>
          </Link>

          {/* Mobile Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground lg:hidden transition-colors"
            aria-label="Close navigation sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Sections */}
        <div className="flex-1 overflow-y-auto px-4 py-5 space-y-6">
          {NAV_SECTIONS.map((section) => (
            <div key={section.title} className="space-y-1.5">
              <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70 font-mono">
                {section.title}
              </p>
              <nav className="space-y-1">
                {section.items.map((item) => {
                  const active = isActive(item.href);
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onClose}
                      className={cn(
                        'group flex h-10 items-center justify-between rounded-lg px-3 text-xs font-medium transition-all duration-150 relative select-none',
                        active
                          ? 'bg-primary/15 text-primary font-semibold shadow-xs border border-primary/30'
                          : 'text-muted-foreground hover:bg-secondary/60 hover:text-foreground',
                      )}
                    >
                      {active && (
                        <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-primary" />
                      )}
                      <div className="flex items-center gap-3">
                        <Icon
                          className={cn(
                            'h-4 w-4 shrink-0 transition-colors',
                            active
                              ? 'text-primary'
                              : 'text-muted-foreground group-hover:text-foreground',
                          )}
                        />
                        <span>{item.title}</span>
                      </div>
                      {item.badge && (
                        <Badge size="sm" variant="active">
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>
          ))}

          {/* Quick System Status Card */}
          <div className="rounded-xl border border-border/70 bg-secondary/30 p-3 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-muted-foreground">API Gateway</span>
              <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-mono">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                ONLINE
              </span>
            </div>
            <p className="text-[10px] text-muted-foreground/80 leading-relaxed">
              RBAC authorization cache active & synchronized.
            </p>
          </div>
        </div>

        {/* User Profile & Logout Footer */}
        <div className="shrink-0 p-4 border-t border-border/60 bg-secondary/15">
          <div className="flex items-center justify-between gap-3">
            <Link
              href="/dashboard/profile"
              onClick={onClose}
              className="flex items-center gap-3 min-w-0 flex-1 hover:opacity-85 transition-opacity group"
              title="Edit Profile & Security"
            >
              <Avatar
                firstName={user?.firstName}
                lastName={user?.lastName}
                email={user?.email}
                avatarUrl={user?.avatarUrl}
                size="sm"
                isOnline={true}
              />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                  {user ? `${user.firstName} ${user.lastName || ''}`.trim() : 'Administrator'}
                </p>
                <p className="text-[10px] text-muted-foreground font-mono truncate">
                  {user?.email || 'admin@studyhub.com'}
                </p>
              </div>
            </Link>

            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/15 transition-colors"
              title="Sign Out"
              aria-label="Sign Out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
