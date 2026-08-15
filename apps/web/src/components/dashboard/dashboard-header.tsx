'use client';

import Link from 'next/link';
import { Bell, Menu } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useDashboardSidebar } from './dashboard-mobile-menu';
import { DashboardBreadcrumbs } from './dashboard-breadcrumbs';
import { DashboardSearch } from './dashboard-search';
import { ThemeToggle } from '../marketing/navbar/theme-toggle';

export function DashboardHeader() {
  const pathname = usePathname();

  const { openMobileSidebar } = useDashboardSidebar();

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-border/70 bg-background/85 backdrop-blur-xl">
      <div className="flex h-full items-center gap-3 px-4 sm:px-6 lg:px-8">
        <MobileMenuButton onClick={openMobileSidebar} />
        <DashboardBreadcrumbs pathname={pathname} />
        <div className="ml-auto flex items-center gap-4">
          <DashboardSearch />
          <NotificationButton />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

interface MobileMenuButtonProps {
  readonly onClick: () => void;
}

function MobileMenuButton({ onClick }: MobileMenuButtonProps) {
  return (
    <button
      type="button"
      aria-label="Open navigation menu"
      onClick={onClick}
      className={cn(
        'flex size-9 shrink-0 items-center justify-center rounded-lg',
        'text-muted-foreground',
        'transition-colors',
        'hover:bg-muted hover:text-foreground',
        'focus-visible:outline-none',
        'focus-visible:ring-2',
        'focus-visible:ring-primary/40',
        'md:hidden',
      )}
    >
      <Menu aria-hidden="true" className="size-5" />
    </button>
  );
}

function NotificationButton() {
  return (
    <Link
      href="/notifications"
      aria-label="Notifications"
      className={cn(
        'relative flex size-9 items-center justify-center rounded-lg',
        'text-muted-foreground',
        'transition-colors',
        'bg-muted hover:text-foreground',
        'focus-visible:outline-none',
        'focus-visible:ring-2',
        'focus-visible:ring-primary/40',
        'focus-visible:ring-offset-2',
      )}
    >
      <Bell aria-hidden="true" className="size-4.5" />

      <span
        aria-hidden="true"
        className="absolute right-2 top-2 size-1.5 rounded-full bg-primary ring-2 ring-background"
      />

      <span className="sr-only">You have unread notifications</span>
    </Link>
  );
}
