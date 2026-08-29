'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MoreHorizontal } from 'lucide-react';

import { navItems } from './navigation';
import { useMobileNavigation } from './mobile-navigation-provider';

export function MobileBottomNav() {
  const pathname = usePathname();
  const { isMoreOpen, openMore } = useMobileNavigation();

  return (
    <nav
      aria-label="Mobile bottom navigation"
      className="fixed inset-x-0 bottom-4 z-50 flex justify-center px-4 md:hidden"
    >
      <div className="flex h-16 w-full max-w-md items-center justify-between gap-1 rounded-full border border-border/80 bg-background/80 p-1.5 shadow-2xl shadow-black/15 backdrop-blur-xl transition-all duration-300">
        {navItems.slice(0, 4).map((item) => {
          const Icon = item.icon;
          const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? 'page' : undefined}
              className={`group flex h-12 min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-full transition-all duration-200 active:scale-95 ${
                isActive
                  ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/25'
                  : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
              }`}
            >
              <Icon
                aria-hidden="true"
                className={`size-4.5 shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                  isActive ? 'scale-105' : ''
                }`}
              />
              <span className="text-[10px] font-semibold tracking-tight leading-none">
                {item.label}
              </span>
            </Link>
          );
        })}

        {/* More Trigger Button */}
        <button
          type="button"
          onClick={openMore}
          aria-label="Open navigation menu"
          aria-haspopup="dialog"
          aria-expanded={isMoreOpen}
          className={`group flex h-12 min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-full transition-all duration-200 active:scale-95 ${
            isMoreOpen
              ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/25'
              : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
          }`}
        >
          <MoreHorizontal
            aria-hidden="true"
            className={`size-4.5 shrink-0 transition-transform duration-200 group-hover:scale-110 ${
              isMoreOpen ? 'scale-105' : ''
            }`}
          />
          <span className="text-[10px] font-semibold tracking-tight leading-none">More</span>
        </button>
      </div>
    </nav>
  );
}
