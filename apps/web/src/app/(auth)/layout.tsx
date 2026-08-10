import type { ReactNode } from 'react';

import { ThemeToggle } from '@/components/marketing/navbar/theme-toggle';
import Link from 'next/link';

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <header className="absolute inset-x-0 top-0 z-50">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" aria-label="StudyHub home" className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
              S
            </span>

            <span className="text-lg font-semibold tracking-tight">StudyHub</span>
          </Link>

          <ThemeToggle />
        </div>
      </header>

      <main className="flex min-h-dvh items-center justify-center px-4 py-20 sm:px-6">
        <div className="w-full max-w-md">{children}</div>
      </main>
    </div>
  );
}
