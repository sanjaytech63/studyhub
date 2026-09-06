'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, ChevronRight, Search, ExternalLink, ShieldCheck } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ThemeToggle } from '../theme/theme-toggle';
import { AdminUserMenu } from './admin-user-menu';

export interface AdminTopbarProps {
  readonly onOpenSidebar?: () => void;
}

export function AdminTopbar({ onOpenSidebar }: AdminTopbarProps) {
  const pathname = usePathname();

  // Generate breadcrumbs from path
  const pathSegments = pathname
    .split('/')
    .filter(Boolean)
    .map((seg) => {
      if (seg === 'dashboard') return 'Dashboard';
      if (seg === 'users') return 'Users Directory';
      if (seg === 'roles') return 'Roles & RBAC';
      if (seg === 'permissions') return 'Permissions Matrix';
      return seg.charAt(0).toUpperCase() + seg.slice(1);
    });

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border/70 bg-background/80 px-6 backdrop-blur-xl transition-all">
      {/* Left: Mobile Toggle + Breadcrumbs */}
      <div className="flex items-center gap-4">
        <button
          onClick={onOpenSidebar}
          className="rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-foreground lg:hidden"
          aria-label="Toggle Navigation Sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>

        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs">
          <Link
            href="/dashboard"
            className="text-muted-foreground hover:text-foreground transition-colors font-medium"
          >
            Admin
          </Link>
          {pathSegments.map((seg, i) => (
            <React.Fragment key={seg}>
              <ChevronRight className="h-3 w-3 text-muted-foreground/60" />
              <span
                className={
                  i === pathSegments.length - 1
                    ? 'font-semibold text-foreground'
                    : 'text-muted-foreground font-medium'
                }
              >
                {seg}
              </span>
            </React.Fragment>
          ))}
        </nav>
      </div>

      {/* Right: Environment / Status + Web Link + Theme Toggle + User Menu */}
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
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
