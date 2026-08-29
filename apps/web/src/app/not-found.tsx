'use client';

import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Compass,
  FileQuestion,
  Home,
  LifeBuoy,
  MoveRight,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

/* ==========================================================================
   TYPES
========================================================================== */

interface QuickLinkItem {
  readonly title: string;
  readonly description: string;
  readonly href: string;
  readonly icon: React.ElementType;
}

/* ==========================================================================
   DATA
========================================================================== */

const QUICK_LINKS: readonly QuickLinkItem[] = [
  {
    title: 'Explore Courses',
    description: 'Browse interactive learning paths and projects.',
    href: '/courses',
    icon: Compass,
  },
  {
    title: 'Documentation',
    description: 'Read guides, API references, and architecture blueprints.',
    href: '/docs',
    icon: FileQuestion,
  },
  {
    title: 'Support Hub',
    description: 'Get assistance from our team or community.',
    href: '/support',
    icon: LifeBuoy,
  },
];

/* ==========================================================================
   MAIN 404 PAGE
========================================================================== */

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-hidden bg-background font-sans antialiased">
      {/* Background Grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[32px_32px] sm:bg-size[size:36px_36px]"
      />

      {/* Primary Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 -top-40 -z-10 size-72 rounded-full bg-primary/10 blur-[100px] sm:size-96 sm:blur-[120px]"
      />

      {/* Secondary Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 -right-40 -z-10 size-72 rounded-full bg-primary/5 blur-[100px] sm:size-96 sm:blur-[140px]"
      />

      {/* Main */}
      <main className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="mx-auto flex w-full max-w-4xl flex-col items-center text-center">
          {/* Status Badge */}
          <Badge
            variant="outline"
            className="inline-flex items-center gap-2 rounded-full border-primary/30 bg-primary/5 px-3 py-1 text-[10px] font-semibold text-primary backdrop-blur-md sm:px-3.5 sm:py-1.5 sm:text-xs"
          >
            <ShieldAlert aria-hidden="true" className="size-3 sm:size-3.5" />
            <span>404 • Page Not Found</span>
          </Badge>

          {/* 404 Number */}
          <div className="relative mt-5 sm:mt-6">
            <span
              aria-hidden="true"
              className="select-none font-mono text-[7rem] font-black leading-none tracking-[-0.08em] text-foreground/4 sm:text-[10rem] md:text-[12rem] lg:text-[14rem]"
            >
              404
            </span>

            <div className="absolute inset-0 flex items-center justify-center">
              <span className="bg-linear-to-r from-primary via-primary/80 to-blue-400 bg-clip-text font-mono text-5xl font-black tracking-tight text-transparent sm:text-7xl md:text-8xl">
                404
              </span>
            </div>
          </div>

          {/* Heading */}
          <div className="-mt-2 flex flex-col items-center sm:-mt-4">
            <div
              aria-hidden="true"
              className="mb-4 flex size-11 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary shadow-inner backdrop-blur-md sm:mb-5 sm:size-12 sm:rounded-2xl"
            >
              <Sparkles className="size-5 sm:size-6" />
            </div>

            <h1 className="max-w-2xl text-2xl font-extrabold leading-tight tracking-tight text-foreground sm:text-4xl md:text-5xl lg:text-6xl">
              Destination{' '}
              <span className="bg-linear-to-r from-primary via-primary/80 to-blue-400 bg-clip-text text-transparent">
                not found.
              </span>
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground sm:mt-5 sm:text-base md:text-lg">
              The page you are looking for does not exist, has been moved, or is no longer
              available. Lets get you back on track.
            </p>
          </div>

          {/* Actions */}
          <div className="mt-7 flex w-full flex-col gap-3 sm:mt-8 sm:w-auto sm:flex-row sm:items-center">
            <Button
              size="lg"
              className="group min-h-11 w-full rounded-xl px-6 font-semibold shadow-lg shadow-primary/20 transition-all duration-300 hover:shadow-primary/30 active:scale-[0.98] sm:w-auto"
            >
              <Link href="/" className="inline-flex items-center justify-center gap-2">
                <Home aria-hidden="true" className="size-4" />
                <span>Return Home</span>
                <ArrowRight
                  aria-hidden="true"
                  className="size-4 transition-transform duration-200 group-hover:translate-x-1"
                />
              </Link>
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="min-h-11 w-full rounded-xl border-border/80 px-6 font-semibold transition-all duration-300 hover:bg-muted/60 active:scale-[0.98] sm:w-auto"
            >
              <Link href="/courses" className="inline-flex items-center justify-center gap-2">
                <Compass aria-hidden="true" className="size-4" />
                <span>Explore Courses</span>
              </Link>
            </Button>

            <Button
              variant="ghost"
              size="lg"
              onClick={() => window.history.back()}
              className="min-h-11 w-full rounded-xl px-6 font-semibold text-muted-foreground transition-all duration-300 hover:text-foreground sm:w-auto"
            >
              <ArrowLeft aria-hidden="true" className="size-4" />
              <span>Go Back</span>
            </Button>
          </div>

          {/* Trust Message */}
          <div className="mt-8 flex max-w-md items-center justify-center gap-2.5 text-center text-[11px] text-muted-foreground sm:mt-10 sm:text-xs">
            <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <CheckCircle2 aria-hidden="true" className="size-3.5" />
            </span>
            <span>Thousands of learners are learning something new every day.</span>
          </div>

          {/* Quick Destinations */}
          <section
            aria-labelledby="quick-destinations-heading"
            className="mt-12 w-full border-t border-border/60 pt-8 sm:mt-16 sm:pt-10"
          >
            <div className="mb-6 flex flex-col items-center">
              <h2
                id="quick-destinations-heading"
                className="text-xs font-extrabold uppercase tracking-[0.18em] text-muted-foreground"
              >
                Continue Exploring
              </h2>

              <p className="mt-2 text-xs text-muted-foreground/80">
                Jump directly to a useful StudyHub destination.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
              {QUICK_LINKS.map((link) => {
                const Icon = link.icon;

                return (
                  <Link
                    key={link.title}
                    href={link.href}
                    className="group flex min-w-0 items-center gap-3 rounded-xl border border-border/60 bg-card/60 p-4 text-left backdrop-blur-md transition-all duration-200 hover:border-primary/40 hover:bg-card hover:shadow-lg sm:flex-col sm:items-center sm:p-5 sm:text-center"
                  >
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary transition-transform duration-200 group-hover:scale-105 sm:size-10">
                      <Icon className="size-4 sm:size-5" />
                    </div>

                    <div className="min-w-0 flex-1 sm:w-full sm:flex-none">
                      <div className="flex items-center justify-between gap-2 sm:justify-center">
                        <h3 className="truncate text-xs font-bold text-foreground transition-colors group-hover:text-primary sm:text-sm">
                          {link.title}
                        </h3>

                        <MoveRight
                          aria-hidden="true"
                          className="size-3.5 shrink-0 text-muted-foreground/40 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-primary sm:hidden"
                        />
                      </div>

                      <p className="mt-1 line-clamp-2 text-[10px] leading-relaxed text-muted-foreground sm:text-xs">
                        {link.description}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-border/40 py-5 text-center text-[10px] text-muted-foreground sm:py-6 sm:text-xs">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-2 px-4 sm:flex-row sm:gap-4">
          <p>© {new Date().getFullYear()} StudyHub. All rights reserved.</p>

          <div className="flex items-center gap-4 font-medium">
            <Link href="/privacy" className="transition-colors hover:text-foreground">
              Privacy Policy
            </Link>

            <Link href="/status" className="transition-colors hover:text-foreground">
              System Status
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
