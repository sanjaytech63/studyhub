'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  BookOpen,
  GraduationCap,
  LayoutDashboard,
  User,
  LogOut,
  Loader2,
  ChevronDown,
} from 'lucide-react';
import { toast } from 'sonner';

import { MarketingContainer } from '../shared/marketing-container';
import { navItems } from './navigation';
import { ThemeToggle } from './theme-toggle';
import { useAuthStore } from '@/store/auth.store';
import { useLogoutMutation } from '@/lib/auth/auth.mutations';
import { getApiErrorMessage } from '@/lib/api/api-error';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function Navbar() {
  const router = useRouter();
  const { isInitialized, isAuthenticated, user } = useAuthStore();
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

  const initials = user?.firstName
    ? `${user.firstName[0]}${user.lastName ? user.lastName[0] : ''}`.toUpperCase()
    : 'U';

  const visibleNavItems = navItems.filter((item) => !item.authOnly || isAuthenticated);

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-border/50 bg-background/80 backdrop-blur-xl supports-backdrop-filter:bg-background/70">
      <MarketingContainer>
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            aria-label="StudyHub Home"
            className="group flex items-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          >
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary shadow-sm shadow-primary/20 transition-transform group-hover:scale-105 active:scale-95">
              <BookOpen className="size-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold tracking-tight text-foreground transition-colors group-hover:text-primary">
              StudyHub
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav aria-label="Main navigation" className="hidden items-center gap-6 md:flex">
            {visibleNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right Action Bar */}
          <div className="flex items-center gap-2 md:gap-4">
            <ThemeToggle />

            {!isInitialized ? (
              <div
                aria-hidden="true"
                className="hidden h-9 w-28 animate-pulse rounded-lg bg-muted/60 md:block"
              />
            ) : !isAuthenticated ? (
              <div className="hidden items-center gap-2.5 md:flex">
                <Button asChild variant="ghost" size="sm">
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button asChild variant="default" size="sm">
                  <Link href="/register">Get Started</Link>
                </Button>
              </div>
            ) : (
              <div className="hidden items-center gap-3 md:flex">
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center gap-2 rounded-full p-1 transition-colors hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 cursor-pointer">
                    <Avatar size="sm">
                      {user?.avatarUrl && <AvatarImage src={user.avatarUrl} alt={user.firstName} />}
                      <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                    <span className="max-w-[120px] truncate text-xs font-semibold text-foreground">
                      {user?.firstName}
                    </span>
                    <ChevronDown className="size-3.5 text-muted-foreground" />
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-semibold text-foreground">
                          {user?.firstName} {user?.lastName ?? ''}
                        </p>
                        <p className="truncate text-xs font-mono text-muted-foreground">
                          {user?.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                      onClick={() => router.push('/learning')}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <GraduationCap className="size-4 text-primary" />
                      <span>My Learning</span>
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={() => router.push('/dashboard')}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <LayoutDashboard className="size-4 text-muted-foreground" />
                      <span>Learner Dashboard</span>
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={() => router.push('/profile')}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <User className="size-4 text-muted-foreground" />
                      <span>Account Settings</span>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                      onClick={handleLogout}
                      disabled={logoutMutation.isPending}
                      className="flex items-center gap-2 cursor-pointer text-destructive focus:text-destructive"
                    >
                      {logoutMutation.isPending ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <LogOut className="size-4" />
                      )}
                      <span>Sign Out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>
        </div>
      </MarketingContainer>
    </header>
  );
}
