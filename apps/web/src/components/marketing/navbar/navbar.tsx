'use client';

import Link from 'next/link';
import { BookOpen, Loader2, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { MarketingContainer } from '../shared/marketing-container';
import { navItems } from './navigation';
import { ThemeToggle } from './theme-toggle';

import { useAuthStore } from '@/store/auth.store';
import { useLogoutMutation } from '@/lib/auth/auth.mutations';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

export function Navbar() {
  const router = useRouter();
  const { isInitialized, isAuthenticated } = useAuthStore();
  const logoutMutation = useLogoutMutation();

  async function handleLogout() {
    try {
      await logoutMutation.mutateAsync();
      toast.success('You have been logged out.');
    } finally {
      router.replace('/login');
    }
  }

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
          <Link
            href="/"
            aria-label="StudyHub Home"
            className="group flex items-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          >
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary shadow-sm shadow-primary/20 transition-transform group-hover:scale-105 active:scale-95">
              <BookOpen className="size-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold tracking-tight text-foreground transition-colors group-hover:text-primary">
              StudyHub
            </span>
          </Link>

          <nav aria-label="Main navigation" className="hidden items-center gap-6 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  'text-sm font-medium',
                  'text-muted-foreground',
                  'transition-colors',
                  'hover:text-foreground',
                ].join(' ')}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 md:gap-4">
            <ThemeToggle />

            {!isInitialized ? (
              <div aria-hidden="true" className="hidden h-9 w-32 rounded-lg bg-muted/50 md:block" />
            ) : (
              <div className="hidden items-center gap-3 md:flex">
                {!isAuthenticated ? (
                  <>
                    <Link
                      href="/login"
                      className={[
                        'inline-flex h-9 items-center justify-center',
                        'rounded-lg border border-border px-4',
                        'text-sm font-medium',
                        'text-muted-foreground',
                        'transition-colors',
                        'hover:bg-accent',
                        'hover:text-foreground',
                      ].join(' ')}
                    >
                      Login
                    </Link>

                    <Link
                      href="/register"
                      className={[
                        'inline-flex h-9 items-center justify-center',
                        'rounded-lg bg-primary px-4',
                        'text-sm font-medium',
                        'text-primary-foreground',
                        'shadow-sm',
                        'transition-all',
                        'hover:bg-primary/90',
                        'active:scale-[0.98]',
                      ].join(' ')}
                    >
                      Get Started
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      href="/dashboard"
                      className={[
                        'inline-flex h-9 items-center justify-center',
                        'rounded-lg border border-border px-4',
                        'text-sm font-medium',
                        'text-muted-foreground',
                        'transition-colors',
                        'hover:bg-accent',
                        'hover:text-foreground',
                      ].join(' ')}
                    >
                      Dashboard
                    </Link>

                    <Button
                      type="button"
                      variant={'destructive'}
                      size={'lg'}
                      onClick={handleLogout}
                      disabled={logoutMutation.isPending}
                    >
                      {logoutMutation.isPending ? (
                        <Loader2 aria-hidden="true" className="size-4 animate-spin" />
                      ) : (
                        <LogOut aria-hidden="true" className="size-4" />
                      )}

                      {logoutMutation.isPending ? 'Signing out...' : 'Logout'}
                    </Button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </MarketingContainer>
    </header>
  );
}
