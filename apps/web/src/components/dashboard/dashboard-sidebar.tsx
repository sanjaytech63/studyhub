'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PanelLeftClose, PanelLeftOpen, X } from 'lucide-react';

import { cn } from '@/lib/utils';
import { dashboardNavigation } from '@/lib/dashboard/dashboard.constants';
import { isActiveRoute } from '@/lib/dashboard/dashboard.utils';

import { DashboardUserMenu } from './dashboard-user-menu';
import { useDashboardSidebar } from './dashboard-mobile-menu';

export function DashboardSidebar() {
  const pathname = usePathname();
  const { isMobileOpen, isCollapsed, closeMobileSidebar, toggleCollapsed } = useDashboardSidebar();

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileOpen) {
        closeMobileSidebar();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobileOpen, closeMobileSidebar]);

  return (
    <>
      {/* Mobile Drawer Overlay */}
      <div
        aria-hidden={!isMobileOpen}
        onClick={closeMobileSidebar}
        className={cn(
          'fixed inset-0 z-40 bg-black/60 backdrop-blur-xs transition-opacity duration-300 md:hidden',
          isMobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
        )}
      />

      {/* Main Sidebar Drawer */}
      <aside
        aria-label="Dashboard navigation"
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex flex-col border-r border-border/70 bg-background/95 backdrop-blur-xl ease-[cubic-bezier(0.16,1,0.3,1)] transition-all duration-300 md:z-30',
          isCollapsed ? 'md:w-20' : 'md:w-64',
          'w-72 max-w-[85vw]',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
        )}
      >
        {/* Brand & Workspace Header */}
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-border/60 px-4">
          <Link
            href="/"
            onClick={closeMobileSidebar}
            className={cn(
              'group flex items-center gap-3 rounded-xl transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40',
              isCollapsed && 'w-full justify-center',
            )}
          >
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-primary via-primary/90 to-primary/70 font-bold text-primary-foreground shadow-md shadow-primary/25 transition-transform duration-200 group-hover:scale-105">
              S
            </div>
            {!isCollapsed && (
              <div className="flex flex-col whitespace-nowrap leading-tight">
                <span className="text-sm font-bold tracking-tight text-foreground">StudyHub</span>
                <span className="text-[11px] font-medium text-muted-foreground/80">Workspace</span>
              </div>
            )}
          </Link>

          {/* Desktop Collapse Trigger */}
          {!isCollapsed && (
            <button
              type="button"
              onClick={toggleCollapsed}
              aria-label="Collapse sidebar"
              className="hidden size-8 items-center justify-center rounded-lg border border-border/60 bg-muted/20 text-muted-foreground transition-all hover:bg-muted hover:text-foreground active:scale-95 md:flex"
            >
              <PanelLeftClose className="size-4" />
            </button>
          )}

          {/* Mobile Dismiss Button */}
          <button
            type="button"
            onClick={closeMobileSidebar}
            aria-label="Close navigation"
            className="flex size-8 items-center justify-center rounded-lg border border-border/60 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground md:hidden"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Scrollable Navigation Groups */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden p-3.5 space-y-6 crollbar-thin">
          {dashboardNavigation.map((section, idx) => (
            <div key={section.label || idx} className="space-y-1.5">
              {!isCollapsed ? (
                <h3 className="mb-2 px-3 text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground/60 whitespace-nowrap select-none">
                  {section.label}
                </h3>
              ) : (
                <div className="my-2.5 mx-auto h-px w-8 bg-border/60" />
              )}

              {section.items.map((item) => {
                const Icon = item.icon;
                const active = isActiveRoute(pathname, item.href);

                return (
                  <div key={item.href} className="relative group/navitem">
                    <Link
                      href={item.href}
                      onClick={closeMobileSidebar}
                      aria-current={active ? 'page' : undefined}
                      className={cn(
                        'flex h-10 items-center gap-3.5 rounded-lg text-sm font-medium transition-all duration-200 active:scale-[0.98]',
                        active
                          ? 'bg-primary text-primary-foreground font-semibold shadow-md shadow-primary/20'
                          : 'text-muted-foreground hover:bg-muted/80 hover:text-foreground',
                        isCollapsed ? 'justify-center px-0' : 'px-3',
                      )}
                    >
                      <Icon
                        className={cn(
                          'size-4.5 shrink-0 transition-transform duration-200 group-hover/navitem:scale-110',
                          active
                            ? 'text-primary-foreground'
                            : 'text-muted-foreground group-hover/navitem:text-foreground',
                        )}
                      />
                      {!isCollapsed && (
                        <span className="truncate whitespace-nowrap">{item.label}</span>
                      )}
                    </Link>

                    {/* Desktop Floating Tooltip Badge */}
                    {isCollapsed && (
                      <div className="pointer-events-none fixed left-22 z-50 hidden rounded-lg border border-border bg-popover px-3 py-1.5 text-xs font-semibold text-popover-foreground shadow-xl shadow-black/10 opacity-0 transition-all duration-200 group-hover/navitem:opacity-100 group-hover/navitem:translate-x-1 md:block whitespace-nowrap">
                        {item.label}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Expand Action for Collapsed Desktop Mode */}
        {isCollapsed && (
          <div className="hidden border-t border-border/60 p-2.5 md:flex justify-center">
            <button
              type="button"
              onClick={toggleCollapsed}
              aria-label="Expand sidebar"
              className="flex size-9 items-center justify-center rounded-xl border border-border/60 bg-muted/20 text-muted-foreground transition-all hover:bg-muted hover:text-foreground active:scale-95"
            >
              <PanelLeftOpen className="size-4" />
            </button>
          </div>
        )}

        {/* User Account Controls */}
        <div className="shrink-0 border-t border-border/60 p-3">
          <DashboardUserMenu isCollapsed={isCollapsed} />
        </div>
      </aside>
    </>
  );
}
