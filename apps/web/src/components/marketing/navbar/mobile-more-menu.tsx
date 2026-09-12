'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ChevronRight, LogIn, Sparkles, X } from 'lucide-react';

import { navItems } from './navigation';
import { useMobileNavigation } from './mobile-navigation-provider';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/auth.store';
import { useLogoutMutation } from '@/lib/auth/auth.mutations';

export function MobileMoreMenu() {
  const router = useRouter();
  const pathname = usePathname();
  const { isMoreOpen, closeMore } = useMobileNavigation();
  const { isAuthenticated, user } = useAuthStore();
  const logoutMutation = useLogoutMutation();

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
                        className={`flex size-9 items-center justify-center rounded-lg ${
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
            {!isAuthenticated ? (
              <div className="grid grid-cols-2 gap-3">
                <Button asChild variant="outline" className="h-11 rounded-lg">
                  <Link href="/login" onClick={closeMore}>
                    <LogIn className="size-4 mr-1.5" />
                    <span>Log In</span>
                  </Link>
                </Button>

                <Button asChild variant="default" className="h-11 rounded-lg">
                  <Link href="/register" onClick={closeMore}>
                    <Sparkles className="size-4 mr-1.5" />
                    <span>Get Started</span>
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-3 px-1">
                  <div className="flex size-9 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground text-xs">
                    {user?.firstName?.[0]?.toUpperCase() ?? 'U'}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-foreground truncate">
                      {user?.firstName} {user?.lastName ?? ''}
                    </p>
                    <p className="text-[11px] font-mono text-muted-foreground truncate">
                      {user?.email}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Button asChild variant="outline" size="sm" className="rounded-lg">
                    <Link href="/profile" onClick={closeMore}>
                      Settings
                    </Link>
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="rounded-lg"
                    onClick={() => {
                      closeMore();
                      void logoutMutation.mutateAsync().finally(() => router.replace('/login'));
                    }}
                  >
                    Sign Out
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
