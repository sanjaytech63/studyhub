'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, LogIn, Sparkles, X } from 'lucide-react';

import { navItems } from './navigation';
import { useMobileNavigation } from './mobile-navigation-provider';

export function MobileMoreMenu() {
  const pathname = usePathname();
  const { isMoreOpen, closeMore } = useMobileNavigation();

  // Close menu on route changes
  React.useEffect(() => {
    closeMore();
  }, [pathname, closeMore]);

  // Prevent body scroll when menu is active
  React.useEffect(() => {
    if (!isMoreOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isMoreOpen]);

  // Keyboard accessibility
  React.useEffect(() => {
    if (!isMoreOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeMore();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMoreOpen, closeMore]);

  return (
    <>
      {/* Backdrop */}
      <div
        aria-hidden={!isMoreOpen}
        onClick={closeMore}
        className={`fixed inset-0 z-100 bg-black/50 backdrop-blur-md transition-opacity duration-300 md:hidden ${
          isMoreOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />

      {/* Centered Modal Overlay Container */}
      <div
        className={`fixed inset-0 z-110 flex items-center justify-center p-4 sm:p-6 md:hidden transition-all duration-300 ease-out ${
          isMoreOpen
            ? 'pointer-events-auto opacity-100 scale-100'
            : 'pointer-events-none opacity-0 scale-95'
        }`}
      >
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="mobile-nav-title"
          onClick={(e) => e.stopPropagation()}
          className="flex max-h-[85vh] w-full max-w-md flex-col overflow-hidden rounded-3xl border border-border/80 bg-background/95 shadow-2xl backdrop-blur-2xl"
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between border-b border-border/50 px-5 py-4 sm:px-6">
            <div>
              <h2
                id="mobile-nav-title"
                className="text-lg font-bold tracking-tight text-foreground"
              >
                Navigation
              </h2>
              <p className="text-xs text-muted-foreground">Access all features and tools</p>
            </div>

            <button
              type="button"
              onClick={closeMore}
              aria-label="Close menu"
              className="inline-flex size-9 items-center justify-center rounded-full border border-border/80 bg-muted/40 text-muted-foreground transition-all hover:bg-muted active:scale-95"
            >
              <X aria-hidden="true" className="size-4" />
            </button>
          </div>

          {/* Nav List */}
          <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-6">
            <nav aria-label="Main expanded menu" className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive =
                  item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeMore}
                    className={`flex h-13 items-center justify-between rounded-2xl px-4 transition-all duration-200 active:scale-[0.98] ${
                      isActive
                        ? 'bg-primary text-primary-foreground font-semibold shadow-md shadow-primary/15'
                        : 'bg-muted/30 text-foreground hover:bg-muted/60'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div
                        className={`flex size-9 items-center justify-center rounded-xl ${
                          isActive
                            ? 'bg-primary-foreground/20 text-primary-foreground'
                            : 'bg-background border border-border/60 text-muted-foreground'
                        }`}
                      >
                        <Icon aria-hidden="true" className="size-4.5" />
                      </div>
                      <span className="text-sm tracking-tight">{item.label}</span>
                    </div>

                    <ChevronRight aria-hidden="true" className="size-4 opacity-50" />
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Authentication Actions Footer */}
          <div className="border-t border-border/60 bg-muted/20 p-4 sm:p-5">
            <div className="grid grid-cols-2 gap-3">
              <Link
                href="/login"
                onClick={closeMore}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-border/80 bg-background text-sm font-semibold text-foreground shadow-sm transition-all hover:bg-accent active:scale-[0.98]"
              >
                <LogIn className="size-4" />
                <span>Log In</span>
              </Link>

              <Link
                href="/register"
                onClick={closeMore}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary text-sm font-semibold text-primary-foreground shadow-md shadow-primary/20 transition-all hover:bg-primary/90 active:scale-[0.98]"
              >
                <Sparkles className="size-4" />
                <span>Get Started</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
