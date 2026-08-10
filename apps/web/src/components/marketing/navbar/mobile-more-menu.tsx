'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { X } from 'lucide-react';

import { navItems } from './navigation';
import { useMobileNavigation } from './mobile-navigation-provider';

export function MobileMoreMenu() {
  const pathname = usePathname();

  const { isMoreOpen, closeMore } = useMobileNavigation();

  /*
   * Close menu when route changes.
   */
  useEffect(() => {
    closeMore();
  }, [pathname, closeMore]);

  /*
   * Lock background scrolling while modal is open.
   */
  useEffect(() => {
    if (!isMoreOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isMoreOpen]);

  /*
   * Escape key closes the modal.
   */
  useEffect(() => {
    if (!isMoreOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeMore();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMoreOpen, closeMore]);

  return (
    <>
      {/* =========================================================
          BACKDROP
          ========================================================= */}

      <div
        aria-hidden={!isMoreOpen}
        onClick={closeMore}
        className={[
          'fixed inset-0 z-100 md:hidden',
          'bg-black/30',
          'backdrop-blur-[3px]',
          'transition-opacity duration-300 ease-out',
          isMoreOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0',
        ].join(' ')}
      />

      {/* =========================================================
          MODAL CONTAINER
          ========================================================= */}

      <div
        className={[
          'fixed inset-0 z-110 md:hidden',
          'flex items-center justify-center',
          'px-5',
          isMoreOpen ? 'pointer-events-auto' : 'pointer-events-none',
        ].join(' ')}
      >
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="studyhub-more-title"
          onClick={(event) => event.stopPropagation()}
          className={[
            'w-full max-w-97.5',
            'overflow-hidden',
            'rounded-[24px]',
            'border border-border/70',
            'bg-background/95',
            'shadow-2xl shadow-black/20',
            'backdrop-blur-2xl',

            'transition-all duration-300',
            'ease-[cubic-bezier(0.22,1,0.36,1)]',

            isMoreOpen
              ? 'translate-y-0 scale-100 opacity-100'
              : 'translate-y-5 scale-[0.96] opacity-0',
          ].join(' ')}
        >
          {/* =====================================================
              HEADER
              ===================================================== */}

          <div className="flex items-center justify-between border-b border-border/60 px-5 pb-4 pt-5">
            <div>
              <h2 id="studyhub-more-title" className="text-base font-semibold tracking-tight">
                More
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">Explore more StudyHub features</p>
            </div>

            <button
              type="button"
              onClick={closeMore}
              aria-label="Close more menu"
              className={[
                'inline-flex size-9 items-center justify-center',
                'rounded-full',
                'border border-border',
                'text-muted-foreground',
                'transition-all duration-200',
                'hover:bg-accent',
                'hover:text-foreground',
                'active:scale-95',
              ].join(' ')}
            >
              <X aria-hidden="true" className="size-4" />
            </button>
          </div>

          {/* =====================================================
              NAVIGATION
              ===================================================== */}

          <div className="max-h-[55vh] overflow-y-auto px-4 py-5">
            <nav aria-label="More navigation">
              <div className="space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon;

                  const isActive =
                    item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={closeMore}
                      className={[
                        'flex h-14 items-center gap-3',
                        'rounded-[16px]',
                        'px-4',
                        'transition-all duration-200',

                        isActive
                          ? [
                              'bg-primary',
                              'text-primary-foreground',
                              'shadow-sm shadow-primary/20',
                            ].join(' ')
                          : ['bg-muted/50', 'text-foreground', 'hover:bg-muted'].join(' '),
                      ].join(' ')}
                    >
                      <span
                        className={[
                          'flex size-9 shrink-0 items-center justify-center',
                          'rounded-xl',
                          isActive ? 'bg-primary-foreground/15' : 'bg-background',
                        ].join(' ')}
                      >
                        <Icon aria-hidden="true" className="size-4.5" />
                      </span>

                      <span className="text-sm font-semibold">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </nav>
          </div>

          {/* =====================================================
              AUTHENTICATION ACTIONS
              ===================================================== */}

          <div className="border-t border-border/60 p-4">
            <div className="grid grid-cols-2 gap-2">
              {/* Login */}

              <Link
                href="/login"
                onClick={closeMore}
                className={[
                  'flex h-11 items-center justify-center',
                  'rounded-xl',
                  'border border-border',
                  'bg-background',
                  'text-sm font-medium',
                  'text-muted-foreground',
                  'transition-all duration-200',
                  'hover:bg-accent',
                  'hover:text-foreground',
                  'active:scale-[0.98]',
                ].join(' ')}
              >
                Login
              </Link>

              {/* Get Started */}

              <Link
                href="/register"
                onClick={closeMore}
                className={[
                  'flex h-11 items-center justify-center',
                  'rounded-xl',
                  'bg-primary',
                  'text-sm font-medium',
                  'text-primary-foreground',
                  'shadow-sm shadow-primary/20',
                  'transition-all duration-200',
                  'hover:bg-primary/90',
                  'active:scale-[0.98]',
                ].join(' ')}
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
