'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PageLoaderProps {
  /** Primary loading text displayed below the indicator */
  readonly message?: string;
  /** Optional secondary metadata string for deeper context */
  readonly submessage?: string;
  /** Optional icon override for the center anchor */
  readonly icon?: React.ElementType;
  /** Optional custom class names for outer wrapper overrides */
  readonly className?: string;
}

export function PageLoader({
  message = 'Restoring your session...',
  submessage,
  icon: Icon = Sparkles,
  className,
}: PageLoaderProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-background p-6 font-sans antialiased select-none',
        className,
      )}
    >
      {/* Ambient Radial Backdrop Spotlight */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent blur-3xl opacity-70"
      />

      {/* Center Loader Composition */}
      <div className="flex flex-col items-center text-center">
        {/* Layered Orbit Spinner Engine */}
        <div className="relative flex size-16 items-center justify-center">
          {/* Outer Pulsing Glow Ring */}
          <div
            aria-hidden="true"
            className="absolute inset-0 rounded-full border border-primary/20 bg-primary/5 animate-ping opacity-25"
          />

          {/* Outer Rotating Track */}
          <div
            aria-hidden="true"
            className="absolute inset-0 rounded-full border-2 border-muted/60"
          />

          {/* Active Orbit Spinner */}
          <div
            aria-hidden="true"
            className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-primary border-r-primary/50"
          />

          {/* Inner Brand/System Icon Anchor */}
          <div className="relative flex size-8 items-center justify-center rounded-full bg-background shadow-xs border border-border/50 text-primary">
            <Icon className="size-4 animate-pulse" />
          </div>
        </div>

        {/* Messaging Area */}
        <div className="mt-6 flex flex-col items-center space-y-1.5 max-w-xs">
          <p className="text-sm font-semibold tracking-tight text-foreground sm:text-base">
            {message}
          </p>

          {submessage && <p className="text-xs font-medium text-muted-foreground">{submessage}</p>}
        </div>
      </div>

      {/* Screen Reader Only Announcement */}
      <span className="sr-only">{message}</span>
    </div>
  );
}
