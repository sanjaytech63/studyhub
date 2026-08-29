'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bell, Menu, Search } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useDashboardSidebar } from './dashboard-mobile-menu';
import { DashboardBreadcrumbs } from './dashboard-breadcrumbs';
import { ThemeToggle } from '../marketing/navbar/theme-toggle';

export function DashboardHeader() {
  const pathname = usePathname();
  const { openMobileSidebar } = useDashboardSidebar();

  return (
    <header className="sticky top-0 z-20 flex h-16 w-full items-center border-b border-border/60 bg-background/80 backdrop-blur-xl transition-all">
      <div className="flex w-full items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left Section: Mobile Navigation & Breadcrumbs */}
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={openMobileSidebar}
            aria-label="Open mobile navigation"
            className="size-9 rounded-xl border-border/60 bg-muted/20 md:hidden"
          >
            <Menu className="size-5 text-muted-foreground" />
          </Button>

          <DashboardBreadcrumbs pathname={pathname} />
        </div>

        {/* Right Section: Typable Search Input, Notifications, Theme Toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          <HeaderCommandSearch />

          {/* Notifications Button */}
          <Button
            variant="outline"
            size="icon"
            className="relative size-9  border-none bg-background text-muted-foreground shadow-2xs hover:text-foreground"
          >
            <Link href="/notifications" aria-label="Notifications">
              <Bell className="size-4.5" />
              <span className="absolute top-2 right-2 flex size-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-primary ring-2 ring-background" />
              </span>
            </Link>
          </Button>

          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

function HeaderCommandSearch() {
  const [query, setQuery] = React.useState('');
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="relative flex w-full max-w-45 items-center sm:w-64 sm:max-w-xs">
      <Search className="pointer-events-none absolute left-3 size-3.5 text-muted-foreground/70" />

      <Input
        ref={inputRef}
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search platform..."
        className=" w-full  border-border/80 bg-muted/30 pl-8 pr-11 text-xs shadow-2xs transition-all placeholder:text-muted-foreground/70 hover:border-border hover:bg-muted/50 focus-visible:bg-background focus-visible:ring-primary/40"
      />

      <kbd className="pointer-events-none absolute right-2.5 hidden select-none items-center gap-0.5 rounded-md border border-border/80 bg-background/80 px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground/80 shadow-2xs sm:flex">
        <span className="text-[10px]">⌘</span>K
      </kbd>
    </div>
  );
}
