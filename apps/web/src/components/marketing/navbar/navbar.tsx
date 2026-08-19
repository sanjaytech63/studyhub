'use client';

import Link from 'next/link';
// import { Menu } from 'lucide-react';

import { MarketingContainer } from '../shared/marketing-container';
// import { useMobileNavigation } from './mobile-navigation-provider';
import { navItems } from './navigation';
import { ThemeToggle } from './theme-toggle';

export function Navbar() {
  // const { openMore } = useMobileNavigation();

  return (
    <header
      className={[
        'fixed inset-x-0 top-0 z-40',
        'border-b border-border/50',
        'bg-background/80',
        'backdrop-blur-xl',
        'supports-backdrop-filter:bg-background/70',
      ].join(' ')}
    >
      <MarketingContainer>
        <div className="flex h-16 items-center justify-between">
          {/* =========================================================
              BRAND
              ========================================================= */}

          <Link href="/" aria-label="StudyHub home" className="flex items-center gap-2">
            <span
              className={[
                'flex size-8 items-center justify-center',
                'rounded-lg',
                'bg-primary',
                'text-sm font-bold',
                'text-primary-foreground',
                'shadow-sm',
              ].join(' ')}
            >
              S
            </span>

            <span className="text-lg font-semibold tracking-tight">StudyHub</span>
          </Link>

          {/* =========================================================
              DESKTOP NAVIGATION
              ========================================================= */}

          <nav aria-label="Main navigation" className="hidden items-center gap-6 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  'text-sm font-medium',
                  'text-muted-foreground',
                  'transition-colors duration-200',
                  'hover:text-foreground',
                ].join(' ')}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* =========================================================
              DESKTOP ACTIONS
              ========================================================= */}
          <div className="flex items-center md:gap-4">
            <ThemeToggle />

            <div className="hidden items-center gap-4 md:flex">
              <Link
                href="/login"
                className={[
                  'inline-flex h-9 items-center justify-center',
                  'rounded-lg px-4',
                  'text-sm font-medium',
                  'border border-border',
                  'text-muted-foreground',
                  'transition-colors duration-200',
                  'hover:bg-primary',
                  'hover:text-foreground',
                ].join(' ')}
              >
                Login
              </Link>

              <Link
                href="/register"
                className={[
                  'inline-flex h-9 items-center justify-center',
                  'rounded-lg px-4',
                  'bg-primary',
                  'text-sm font-medium',
                  'text-primary-foreground',
                  'shadow-sm',
                  'transition-all duration-200',
                  'hover:bg-primary/90',
                  'active:scale-[0.98]',
                ].join(' ')}
              >
                Get Started
              </Link>
            </div>

            {/* =========================================================
              MOBILE MENU BUTTON
              
              Opens the SAME More modal used by MobileBottomNav.
              ========================================================= */}

            {/* <button
              type="button"
              onClick={openMore}
              aria-label="Open navigation menu"
              aria-haspopup="dialog"
              className={[
                'inline-flex size-10 items-center justify-center',
                'rounded-full',
                'bg-background/70',
                'text-foreground',
                'backdrop-blur-xl',
                'transition-all duration-200',
                'hover:bg-accent',
                'active:scale-95',
                'md:hidden',
              ].join(' ')}
            >
              <Menu aria-hidden="true" className="size-5" />
            </button> */}
          </div>
        </div>
      </MarketingContainer>
    </header>
  );
}
