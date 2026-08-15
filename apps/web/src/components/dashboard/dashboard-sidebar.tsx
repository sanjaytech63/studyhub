'use client';

import { useId } from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';
import { dashboardNavigation } from '@/lib/dashboard/dashboard.constants';
import { isActiveRoute } from '@/lib/dashboard/dashboard.utils';

import { DashboardUserMenu } from './dashboard-user-menu';
import { useDashboardSidebar } from './dashboard-mobile-menu';

export function DashboardSidebar() {
  const pathname = usePathname();

  const { isMobileOpen, closeMobileSidebar } = useDashboardSidebar();

  return (
    <>
      <MobileSidebarOverlay isOpen={isMobileOpen} onClose={closeMobileSidebar} />

      <aside
        aria-label="Dashboard navigation"
        className={cn(
          'fixed inset-y-0 left-0 z-50',
          'flex w-64 flex-col',
          'border-r border-border/70',
          'bg-background',
          'transition-transform duration-200 ease-out',
          'md:z-40 md:translate-x-0',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <SidebarBrand onNavigate={closeMobileSidebar} onClose={closeMobileSidebar} />

        <SidebarNavigation pathname={pathname} onNavigate={closeMobileSidebar} />

        <SidebarUser />
      </aside>
    </>
  );
}

/* =========================================================
   MOBILE OVERLAY
   ========================================================= */

interface MobileSidebarOverlayProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
}

function MobileSidebarOverlay({ isOpen, onClose }: MobileSidebarOverlayProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <button
      type="button"
      aria-label="Close navigation menu"
      onClick={onClose}
      className={cn('fixed inset-0 z-40', 'bg-black/40 backdrop-blur-[2px]', 'md:hidden')}
    />
  );
}

/* =========================================================
   BRAND
   ========================================================= */

interface SidebarBrandProps {
  readonly onNavigate: () => void;
  readonly onClose: () => void;
}

function SidebarBrand({ onNavigate, onClose }: SidebarBrandProps) {
  return (
    <div className="flex h-16 shrink-0 items-center justify-between border-b border-border/70 px-4">
      <Link
        href="/"
        onClick={onNavigate}
        className={cn(
          'flex items-center gap-3 rounded-lg px-2 py-1.5',
          'focus-visible:outline-none',
          'focus-visible:ring-2',
          'focus-visible:ring-primary/40',
          'focus-visible:ring-offset-2',
        )}
      >
        <span
          aria-hidden="true"
          className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground shadow-sm"
        >
          S
        </span>

        <span className="text-sm font-semibold tracking-tight">StudyHub</span>
      </Link>

      {/* Mobile close button */}
      <button
        type="button"
        onClick={onClose}
        aria-label="Close navigation menu"
        className={cn(
          'flex size-9 shrink-0 items-center justify-center rounded-lg',
          'text-muted-foreground',
          'transition-colors',
          'hover:bg-muted hover:text-foreground',
          'focus-visible:outline-none',
          'focus-visible:ring-2',
          'focus-visible:ring-primary/40',
          'focus-visible:ring-offset-2',
          'md:hidden',
        )}
      >
        <X aria-hidden="true" className="size-5" />
      </button>
    </div>
  );
}

/* =========================================================
   NAVIGATION
   ========================================================= */

interface SidebarNavigationProps {
  readonly pathname: string;
  readonly onNavigate: () => void;
}

function SidebarNavigation({ pathname, onNavigate }: SidebarNavigationProps) {
  return (
    <nav aria-label="Primary navigation" className="min-h-0 flex-1 overflow-y-auto px-3 py-5">
      <div className="space-y-6">
        {dashboardNavigation.map((section) => (
          <SidebarSection
            key={section.label}
            label={section.label}
            items={section.items}
            pathname={pathname}
            onNavigate={onNavigate}
          />
        ))}
      </div>
    </nav>
  );
}

/* =========================================================
   SIDEBAR SECTION
   ========================================================= */

interface SidebarSectionProps {
  readonly label: string;
  readonly items: (typeof dashboardNavigation)[number]['items'];
  readonly pathname: string;
  readonly onNavigate: () => void;
}

function SidebarSection({ label, items, pathname, onNavigate }: SidebarSectionProps) {
  const sectionId = useId();

  return (
    <section aria-labelledby={sectionId}>
      <h2
        id={sectionId}
        className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70"
      >
        {label}
      </h2>

      <div className="space-y-1">
        {items.map((item) => (
          <SidebarNavItem key={item.href} item={item} pathname={pathname} onNavigate={onNavigate} />
        ))}
      </div>
    </section>
  );
}

/* =========================================================
   NAVIGATION ITEM
   ========================================================= */

interface SidebarNavItemProps {
  readonly item: (typeof dashboardNavigation)[number]['items'][number];
  readonly pathname: string;
  readonly onNavigate: () => void;
}

function SidebarNavItem({ item, pathname, onNavigate }: SidebarNavItemProps) {
  const Icon = item.icon;

  const active = isActiveRoute(pathname, item.href);

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'group flex h-10 items-center gap-3 rounded-lg px-3',
        'text-sm font-medium',
        'transition-colors duration-150',
        'focus-visible:outline-none',
        'focus-visible:ring-2',
        'focus-visible:ring-primary/40',
        'focus-visible:ring-offset-2',
        active
          ? 'bg-primary/10 text-primary'
          : ['text-muted-foreground', 'hover:bg-muted', 'hover:text-foreground'],
      )}
    >
      <Icon
        aria-hidden="true"
        className={cn(
          'size-4.5 shrink-0',
          active ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground',
        )}
      />

      <span className="min-w-0 truncate">{item.label}</span>
    </Link>
  );
}

/* =========================================================
   USER
   ========================================================= */

function SidebarUser() {
  return (
    <div className="shrink-0 border-t border-border/70 p-3">
      <DashboardUserMenu />
    </div>
  );
}
