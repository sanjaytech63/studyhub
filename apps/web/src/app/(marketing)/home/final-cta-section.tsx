import Link from 'next/link';
import { ArrowRight, BookOpen, CheckCircle2, Compass, Sparkles, Users, Zap } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

/* ==========================================================================
   DATA
========================================================================== */

const LEARNING_POINTS = [
  {
    title: 'Practical, skill-focused tracks',
    description: 'Built alongside industry leaders to teach real-world execution.',
  },
  {
    title: 'Learn strictly at your pace',
    description: 'Lifetime access with state syncing across all your devices.',
  },
  {
    title: 'Automated progress tracking',
    description: 'Measure milestones and earn verifiable completion badges.',
  },
] as const;

/* ==========================================================================
   MAIN SECTION
========================================================================== */

export function FinalCtaSection() {
  return (
    <section
      aria-labelledby="final-cta-heading"
      className="relative overflow-hidden bg-background pb-12 sm:pb-16 lg:pb-24"
    >
      <div className="mx-auto w-full max-w-7xl px-3 sm:px-6 lg:px-8">
        <Card className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 p-0 text-zinc-100 shadow-2xl sm:rounded-3xl">
          {/* Ambient Background */}
          <CtaBackground />

          {/* Main Content */}
          <div className="relative z-10 grid grid-cols-1 gap-8 p-5 sm:gap-10 sm:p-8 md:p-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-center lg:gap-14 lg:p-14 xl:gap-16 xl:p-20">
            <CtaContent />
            <CtaBenefitsCard />
          </div>
        </Card>
      </div>
    </section>
  );
}

/* ==========================================================================
   BACKGROUND
========================================================================== */

function CtaBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Primary Glow */}
      <div className="absolute -right-24 -top-24 size-72 rounded-full bg-primary/20 blur-[100px] sm:size-96 sm:blur-[120px]" />

      {/* Secondary Glow */}
      <div className="absolute -bottom-24 -left-24 size-72 rounded-full bg-blue-600/15 blur-[100px] sm:size-96 sm:blur-[120px]" />

      {/* Concentric Circles */}
      <div className="absolute -right-16 -top-16 size-64 rounded-full border border-white/5 sm:size-80" />
      <div className="absolute -right-28 -top-28 size-88 rounded-full border border-white/3 sm:size-112" />

      {/* Technical Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-size-[32px_32px]" />

      {/* Fade */}
      <div className="absolute inset-0 bg-linear-to-t from-zinc-950 via-transparent to-zinc-950/80" />
    </div>
  );
}

/* ==========================================================================
   MAIN CTA CONTENT
========================================================================== */

function CtaContent() {
  return (
    <div className="min-w-0 max-w-2xl">
      {/* Eyebrow */}
      <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
        <Badge
          variant="outline"
          className="inline-flex items-center gap-1.5 rounded-full border-primary/30 bg-primary/10 px-3 py-1 text-[10px] font-semibold text-primary-foreground backdrop-blur-md sm:gap-2 sm:px-3.5 sm:text-xs"
        >
          <Sparkles aria-hidden="true" className="size-3 sm:size-3.5" />
          <span>Unlock Your Potential</span>
        </Badge>

        <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-zinc-400 sm:text-xs">
          <Zap aria-hidden="true" className="size-3 text-amber-400 sm:size-3.5" />
          <span>Instant Access</span>
        </span>
      </div>

      {/* Icon */}
      <div
        aria-hidden="true"
        className="mt-5 flex size-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-primary shadow-inner backdrop-blur-md sm:mt-6 sm:size-12 sm:rounded-2xl"
      >
        <BookOpen className="size-5 sm:size-6" />
      </div>

      {/* Heading */}
      <h2
        id="final-cta-heading"
        className="mt-5 text-2xl font-extrabold leading-tight tracking-tight text-white sm:mt-6 sm:text-4xl lg:text-5xl lg:leading-[1.08]"
      >
        Ready to master skills that{' '}
        <span className="bg-linear-to-r from-primary via-primary/80 to-blue-400 bg-clip-text text-transparent">
          shape your future?
        </span>
      </h2>

      {/* Description */}
      <p className="mt-4 max-w-xl text-sm leading-relaxed text-zinc-400 sm:mt-5 sm:text-base lg:text-lg">
        Join over 120,000+ professionals taking practical courses designed to accelerate real career
        growth. Start building today.
      </p>

      {/* Actions */}
      <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:items-center">
        <Button
          size="lg"
          className="group min-h-11 w-full rounded-xl bg-primary px-6 font-bold text-primary-foreground shadow-lg shadow-primary/25 transition-all duration-300 hover:bg-primary/90 hover:shadow-primary/35 active:scale-[0.98] sm:w-auto sm:px-7"
        >
          <Link href="/courses" className="inline-flex items-center justify-center gap-2">
            <span>Explore All Courses</span>
            <ArrowRight
              aria-hidden="true"
              className="size-4 transition-transform duration-200 group-hover:translate-x-1"
            />
          </Link>
        </Button>

        <Button
          size="lg"
          variant="outline"
          className="min-h-11 w-full rounded-xl border-white/15 bg-white/5 font-semibold text-zinc-200 backdrop-blur-md transition-all duration-300 hover:border-white/30 hover:bg-white/10 hover:text-white sm:w-auto"
        >
          <Link href="/categories" className="inline-flex items-center justify-center gap-2">
            <Compass aria-hidden="true" className="size-4 text-zinc-400" />
            <span>Browse Categories</span>
          </Link>
        </Button>
      </div>
    </div>
  );
}

/* ==========================================================================
   BENEFITS CARD
========================================================================== */

function CtaBenefitsCard() {
  return (
    <aside
      aria-label="StudyHub platform advantages"
      className="relative min-w-0 overflow-hidden rounded-xl border border-white/10 bg-white/4 p-4 shadow-xl backdrop-blur-xl sm:rounded-2xl sm:p-6"
    >
      {/* Accent */}
      <div className="absolute inset-x-0 top-0 h-0.5 bg-linear-to-r from-transparent via-primary/60 to-transparent" />

      {/* Header */}
      <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
        <div
          aria-hidden="true"
          className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/20 text-primary sm:rounded-xl"
        >
          <CheckCircle2 className="size-4 sm:size-5" />
        </div>

        <div className="min-w-0">
          <h3 className="truncate text-xs font-bold text-white sm:text-sm">
            The StudyHub Advantage
          </h3>

          <p className="truncate text-[10px] text-zinc-400 sm:text-[11px]">
            Designed for modern learners
          </p>
        </div>
      </div>

      <Separator className="my-4 bg-white/10 sm:my-5" />

      {/* Learning Points */}
      <ul className="space-y-4 sm:space-y-5">
        {LEARNING_POINTS.map((item) => (
          <LearningPointItem key={item.title} item={item} />
        ))}
      </ul>

      {/* Social Proof */}
      <div className="mt-5 flex items-center justify-between gap-3 rounded-lg border border-white/5 bg-white/2 p-3 text-[10px] text-zinc-400 sm:mt-6 sm:rounded-xl sm:text-xs">
        <div className="flex min-w-0 items-center gap-2">
          <Users aria-hidden="true" className="size-3.5 shrink-0 text-primary sm:size-4" />
          <span className="truncate font-medium">Active Students</span>
        </div>

        <span className="shrink-0 font-mono font-bold text-white">120k+</span>
      </div>
    </aside>
  );
}

/* ==========================================================================
   LEARNING POINT ITEM
========================================================================== */

interface LearningPointItemProps {
  readonly item: {
    readonly title: string;
    readonly description: string;
  };
}

function LearningPointItem({ item }: LearningPointItemProps) {
  return (
    <li className="flex min-w-0 items-start gap-2.5 sm:gap-3.5">
      <span
        aria-hidden="true"
        className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary"
      >
        <CheckCircle2 className="size-3.5 stroke-[2.5]" />
      </span>

      <div className="min-w-0">
        <p className="text-[11px] font-bold leading-tight text-zinc-200 sm:text-xs">{item.title}</p>

        <p className="mt-1 text-[10px] leading-relaxed text-zinc-400 sm:text-[11px]">
          {item.description}
        </p>
      </div>
    </li>
  );
}
