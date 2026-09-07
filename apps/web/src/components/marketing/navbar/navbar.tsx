'use client';

import Link from 'next/link';
import { BookOpen, Loader, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { MarketingContainer } from '../shared/marketing-container';
import { navItems } from './navigation';
import { ThemeToggle } from './theme-toggle';

import { useAuthStore } from '@/store/auth.store';
import { useLogoutMutation } from '@/lib/auth/auth.mutations';
import { getApiErrorMessage } from '@/lib/api/api-error';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

export function Navbar() {
  const router = useRouter();
  const { isInitialized, isAuthenticated } = useAuthStore();
  const logoutMutation = useLogoutMutation();

  async function handleLogout() {
    try {
      const result = await logoutMutation.mutateAsync();
      toast.success(result?.message || 'You have been logged out.');
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Unable to sign out.'));
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
              <div
                aria-hidden="true"
                className="hidden h-10 w-32 rounded-lg bg-muted/50 md:block"
              />
            ) : (
              <div className="hidden items-center gap-3 md:flex">
                {!isAuthenticated ? (
                  <>
                    <Button asChild variant="outline">
                      <Link href="/login">Login</Link>
                    </Button>

                    <Button asChild variant="default">
                      <Link href="/register">Get Started</Link>
                    </Button>
                  </>
                ) : (
                  <>
                    <Button asChild variant="outline">
                      <Link href="/dashboard">Dashboard</Link>
                    </Button>

                    <Button
                      type="button"
                      onClick={handleLogout}
                      disabled={logoutMutation.isPending}
                    >
                      {logoutMutation.isPending ? (
                        <Loader aria-hidden="true" className="size-4 animate-spin" />
                      ) : (
                        <LogOut aria-hidden="true" className="size-4" />
                      )}
                      <span>Logout</span>
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
