import type { ReactNode } from 'react';
import Link from 'next/link';
import { BookOpen } from 'lucide-react';

interface AuthCardProps {
  readonly title: string;
  readonly description: string;
  readonly children: ReactNode;
  readonly footer?: ReactNode;
  readonly showLogo?: boolean;
}

export function AuthCard({ title, description, children, footer, showLogo = true }: AuthCardProps) {
  return (
    <div className="w-full">
      {/* Top Emblem like Admin Login Page */}
      {showLogo && (
        <div className="text-center mb-8">
          <Link
            href="/"
            className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-primary to-primary/80 shadow-xl shadow-primary/25 border border-primary/40 mb-4 transition-transform hover:scale-105 active:scale-95"
            aria-label="StudyHub home"
          >
            <BookOpen className="h-7 w-7 text-primary-foreground" />
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">{title}</h1>
          <p className="mt-1.5 text-xs text-muted-foreground">{description}</p>
        </div>
      )}

      {/* Card Body */}
      <div className="rounded-2xl border border-border/80 bg-card/85 p-6 sm:p-7 shadow-2xl backdrop-blur-2xl">
        {!showLogo && (
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">{title}</h1>
            <p className="mt-1.5 text-xs text-muted-foreground">{description}</p>
          </div>
        )}
        {children}
        {footer ? <div className="mt-6 border-t border-border/60 pt-5">{footer}</div> : null}
      </div>
    </div>
  );
}
