'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { BookOpen } from 'lucide-react';
import { ThemeToggle } from '@/components/marketing/navbar/theme-toggle';

interface AuthShellProps {
  readonly children: ReactNode;
}

export function AuthShell({ children }: AuthShellProps) {
  return (
    <div className="relative min-h-dvh bg-background text-foreground overflow-hidden">
      {/* Background ambient gradient blurs */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-96 w-96 rounded-full bg-primary/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl" />

      {/* Grid pattern overlay */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.03)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

      {/* Top Header */}
      <header
        className={[
          'fixed inset-x-0 top-0 z-40',
          'border-b border-border/50',
          'bg-background/80',
          'backdrop-blur-xl',
          'supports-backdrop-filter:bg-background/70',
        ].join(' ')}
      >
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            aria-label="StudyHub home"
            className="group flex items-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          >
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary shadow-sm shadow-primary/20 transition-transform group-hover:scale-105 active:scale-95">
              <BookOpen className="size-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold tracking-tight text-foreground transition-colors group-hover:text-primary">
              StudyHub
            </span>
          </Link>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 flex min-h-dvh items-center justify-center px-4 py-24 sm:px-6">
        <div className="w-full max-w-md animate-in fade-in zoom-in-95 duration-300">{children}</div>
      </main>
    </div>
  );
}
