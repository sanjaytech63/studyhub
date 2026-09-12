'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, ChevronRight, ExternalLink, ShieldCheck, Sparkles } from 'lucide-react';
import { ThemeToggle } from '../theme/theme-toggle';
import { AdminUserMenu } from './admin-user-menu';

export interface AdminTopbarProps {
  readonly onOpenSidebar?: () => void;
  readonly onToggleSidebar?: () => void;
  readonly isSidebarCollapsed?: boolean;
}

export function AdminTopbar({
  onOpenSidebar,
  onToggleSidebar,
  isSidebarCollapsed = false,
}: AdminTopbarProps) {
  const pathname = usePathname();
  const handleToggle = onToggleSidebar ?? onOpenSidebar;

  // Generate breadcrumbs from path
  const pathSegments = pathname
    .split('/')
    .filter(Boolean)
    .map((seg) => {
      if (seg === 'dashboard') return 'Dashboard';
      if (seg === 'users') return 'Users Directory';
      if (seg === 'roles') return 'Roles & RBAC';
      if (seg === 'permissions') return 'Permissions Matrix';
      if (seg === 'profile') return 'Profile & Security';
      return seg.charAt(0).toUpperCase() + seg.slice(1);
    });

  const currentSegment = pathSegments[pathSegments.length - 1] ?? 'Dashboard';

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border/70 bg-background/80 px-3 sm:px-4 md:px-6 backdrop-blur-xl transition-all">
      {/* Left: Menu Icon + Breadcrumbs / Mobile Brand */}
      <div className="flex items-center gap-2 sm:gap-3.5 min-w-0">
        {/* Menu Toggle Button - Always on the far left */}
        <button
          type="button"
          onClick={handleToggle}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border/70 bg-card/60 text-muted-foreground hover:bg-secondary hover:text-foreground hover:border-border transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 cursor-pointer"
          aria-label={
            isSidebarCollapsed ? 'Expand navigation sidebar' : 'Collapse navigation sidebar'
          }
          title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <Menu className="h-4.5 w-4.5" />
        </button>

        {/* Mobile Brand / Page Indicator */}
        <div className="flex sm:hidden items-center gap-1.5 min-w-0">
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 text-xs font-bold tracking-tight text-foreground hover:opacity-80 transition-opacity shrink-0"
            title="StudyHub Admin Dashboard"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/15 text-primary border border-primary/25">
              <Sparkles className="h-3.5 w-3.5" />
            </span>
          </Link>
          {currentSegment !== 'Dashboard' && (
            <div className="flex items-center gap-1 min-w-0 text-xs">
              <ChevronRight className="h-3 w-3 shrink-0 text-muted-foreground/50" />
              <span className="font-semibold text-foreground truncate max-w-[120px]">
                {currentSegment}
              </span>
            </div>
          )}
        </div>

        {/* Desktop / Tablet Breadcrumbs */}
        <nav
          aria-label="Breadcrumb"
          className="hidden sm:flex items-center gap-1.5 text-xs truncate"
        >
          <Link
            href="/dashboard"
            className="text-muted-foreground hover:text-foreground transition-colors font-medium shrink-0"
          >
            Admin
          </Link>
          {pathSegments.map((seg, i) => (
            <React.Fragment key={seg}>
              <ChevronRight className="h-3 w-3 shrink-0 text-muted-foreground/60" />
              <span
                className={
                  i === pathSegments.length - 1
                    ? 'font-semibold text-foreground truncate max-w-[180px] md:max-w-none'
                    : 'text-muted-foreground font-medium truncate max-w-[140px] md:max-w-none'
                }
              >
                {seg}
              </span>
            </React.Fragment>
          ))}
        </nav>
      </div>

      {/* Right: Environment / Status + Web Link + Theme Toggle + User Menu */}
      <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
        <div className="hidden xl:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>RBAC ENFORCED</span>
        </div>

        <a
          href="http://localhost:3000"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-lg hover:bg-secondary border border-transparent hover:border-border"
        >
          <span>Main App</span>
          <ExternalLink className="h-3 w-3" />
        </a>

        {/* Light & Dark Mode Toggle */}
        <ThemeToggle />

        <div className="h-5 w-px bg-border/60 mx-0.5 hidden sm:block" />

        {/* User Menu */}
        <AdminUserMenu />
      </div>
    </header>
  );
}
