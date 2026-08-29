import Link from 'next/link';
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Check,
  GraduationCap,
  Sparkles,
  TrendingUp,
  Users,
  Video,
  Zap,
  type LucideIcon,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

/* ==========================================================================
   TYPES
========================================================================== */

interface InstructorBenefit {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly icon: LucideIcon;
  readonly metric?: string;
}

interface StatBadge {
  readonly label: string;
  readonly value: string;
  readonly change: string;
}

/* ==========================================================================
   DATA
========================================================================== */

const INSTRUCTOR_BENEFITS: readonly InstructorBenefit[] = [
  {
    id: 'create-courses',
    title: 'Intuitive Course Builder',
    description:
      'Turn raw expertise into structured video modules with automated transcription and quiz generators.',
    icon: BookOpen,
    metric: '4x faster setup',
  },
  {
    id: 'reach-learners',
    title: 'Global Audience Reach',
    description:
      'Tap into an active community of over 120,000 motivated professionals eager to upskill.',
    icon: Users,
    metric: '120k+ active students',
  },
  {
    id: 'track-performance',
    title: 'Granular Engagement Analytics',
    description: 'Monitor drop-off points, lesson completions, and revenue velocity in real time.',
    icon: BarChart3,
    metric: 'Real-time insights',
  },
];

const QUICK_STATS: readonly StatBadge[] = [
  { label: 'Avg. Monthly Earn', value: '$4,850', change: '+18%' },
  { label: 'Active Students', value: '12,400', change: '+24%' },
];

/* ==========================================================================
   MAIN SECTION
========================================================================== */

export function InstructorSection() {
  return (
    <section
      aria-labelledby="instructor-heading"
      className="relative overflow-hidden bg-background pb-12 sm:pb-16 lg:pb-24"
    >
      {/* Background Ambient Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-80 w-full max-w-7xl -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent blur-3xl sm:h-125"
      />

      <div className="mx-auto w-full max-w-7xl px-3 sm:px-6 lg:px-8">
        <Card className="relative overflow-hidden rounded-2xl border border-border/60 bg-card/60 p-0 shadow-2xl backdrop-blur-xl sm:rounded-3xl">
          {/* Top Accent */}
          <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-transparent via-primary to-transparent opacity-80" />

          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
            <InstructorMessage />
            <InstructorStudioPreview />
          </div>
        </Card>
      </div>
    </section>
  );
}

/* ==========================================================================
   INSTRUCTOR MESSAGE
========================================================================== */

function InstructorMessage() {
  return (
    <div className="flex min-w-0 flex-col justify-between p-5 sm:p-8 lg:p-10 xl:p-14">
      <div>
        <Badge
          variant="outline"
          className="inline-flex items-center gap-2 rounded-full border-primary/20 bg-primary/5 px-3 py-1 text-[11px] font-semibold text-primary backdrop-blur-sm sm:px-3.5 sm:text-xs"
        >
          <GraduationCap aria-hidden="true" className="size-3.5" />
          <span>Instructor Ecosystem</span>
        </Badge>

        <h2
          id="instructor-heading"
          className="mt-5 text-2xl font-extrabold leading-tight tracking-tight text-foreground sm:mt-6 sm:text-4xl lg:text-5xl lg:leading-[1.12]"
        >
          Share what you know.{' '}
          <span className="bg-linear-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
            Teach the world.
          </span>
        </h2>

        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:mt-5 sm:text-base lg:text-lg">
          Transform your real-world experience into an interactive course. Reach thousands of
          ambitious learners with platform tools engineered for deep engagement.
        </p>

        {/* Benefits */}
        <div className="mt-7 space-y-5 sm:mt-8 sm:space-y-6">
          {INSTRUCTOR_BENEFITS.map((benefit) => (
            <BenefitRow key={benefit.id} benefit={benefit} />
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="mt-8 border-t border-border/60 pt-6 sm:mt-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <Button
            size="lg"
            className="group min-h-11 w-full rounded-xl px-6 text-sm font-bold shadow-lg shadow-primary/25 transition-all duration-300 hover:shadow-primary/35 sm:w-auto"
          >
            <Link href="/instructors" className="flex gap-2 items-center">
              <span>Start Teaching Today</span>
              <ArrowRight
                aria-hidden="true"
                className="size-4 transition-transform duration-200 group-hover:translate-x-1"
              />
            </Link>
          </Button>

          <div className="flex items-center justify-center gap-2 text-xs font-medium text-muted-foreground sm:justify-start">
            <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
              <Check aria-hidden="true" className="size-3 stroke-3" />
            </span>
            <span>$0 platform setup fee</span>
          </div>
        </div>

        <p className="mt-3 text-center text-[11px] leading-relaxed text-muted-foreground/80 sm:text-left sm:text-xs">
          No prior online teaching experience required. Full curriculum support included.
        </p>
      </div>
    </div>
  );
}

/* ==========================================================================
   BENEFIT ROW
========================================================================== */

interface BenefitRowProps {
  readonly benefit: InstructorBenefit;
}

function BenefitRow({ benefit }: BenefitRowProps) {
  const Icon = benefit.icon;

  return (
    <div className="group flex min-w-0 items-start gap-3 sm:gap-4">
      <div
        aria-hidden="true"
        className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground sm:size-11 sm:rounded-2xl"
      >
        <Icon className="size-4.5 sm:size-5" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex min-w-0 flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-2">
          <h3 className="min-w-0 text-sm font-bold leading-snug text-foreground sm:text-base">
            {benefit.title}
          </h3>

          {benefit.metric && (
            <span className="w-fit shrink-0 rounded-full bg-muted/80 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-muted-foreground sm:px-2.5 sm:text-[10px]">
              {benefit.metric}
            </span>
          )}
        </div>

        <p className="mt-1 text-xs leading-relaxed text-muted-foreground sm:text-sm">
          {benefit.description}
        </p>
      </div>
    </div>
  );
}

/* ==========================================================================
   INSTRUCTOR STUDIO PREVIEW
========================================================================== */

function InstructorStudioPreview() {
  return (
    <div className="relative flex min-w-0 flex-col justify-center border-t border-border/60 bg-muted/30 p-4 sm:p-8 lg:border-l lg:border-t-0 lg:p-10 xl:p-12">
      {/* Studio Mockup */}
      <div className="relative min-w-0 rounded-xl border border-border/80 bg-card/90 p-3.5 shadow-xl backdrop-blur-md sm:rounded-2xl sm:p-5">
        {/* Studio Header */}
        <div className="flex min-w-0 items-center justify-between gap-3 border-b border-border/60 pb-3 sm:pb-4">
          <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary sm:size-9 sm:rounded-xl">
              <Video aria-hidden="true" className="size-3.5 sm:size-4" />
            </div>

            <div className="min-w-0">
              <p className="truncate text-[10px] font-bold uppercase tracking-wider text-primary sm:text-xs">
                Instructor Studio
              </p>

              <h4 className="truncate text-xs font-extrabold text-foreground sm:text-sm">
                Advanced React Masterclass
              </h4>
            </div>
          </div>

          <Badge
            variant="secondary"
            className="shrink-0 gap-1 border-emerald-500/20 bg-emerald-500/10 px-2 py-1 text-[9px] text-emerald-600 sm:text-[11px]"
          >
            <Sparkles aria-hidden="true" className="size-2.5 sm:size-3" />
            <span>Published</span>
          </Badge>
        </div>

        {/* Live Stats */}
        <div className="mt-3 grid grid-cols-2 gap-2.5 sm:mt-4 sm:gap-3">
          {QUICK_STATS.map((stat) => (
            <div
              key={stat.label}
              className="min-w-0 rounded-lg border border-border/50 bg-background/50 p-3 backdrop-blur-xs sm:rounded-xl sm:p-3.5"
            >
              <p className="truncate text-[9px] font-medium text-muted-foreground sm:text-[11px]">
                {stat.label}
              </p>

              <div className="mt-1 flex min-w-0 items-center justify-between gap-2">
                <span className="truncate text-base font-extrabold text-foreground sm:text-lg">
                  {stat.value}
                </span>

                <span className="flex shrink-0 items-center text-[9px] font-bold text-emerald-500 sm:text-[10px]">
                  <TrendingUp aria-hidden="true" className="mr-0.5 size-2.5 sm:size-3" />
                  {stat.change}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Course Progress */}
        <div className="mt-3 rounded-lg border border-border/50 bg-background/50 p-3 sm:mt-4 sm:rounded-xl sm:p-4">
          <div className="flex items-center justify-between gap-2 text-[10px] font-bold sm:text-xs">
            <span className="truncate text-foreground">Course Completion Rate</span>

            <span className="shrink-0 text-primary">94.2%</span>
          </div>

          <Progress value={94} className="mt-2 h-1.5 bg-muted sm:h-2" />

          <div className="mt-2 flex items-center justify-between gap-2 text-[9px] text-muted-foreground sm:mt-3 sm:text-[11px]">
            <span>28 Modules</span>
            <span>1,420 Submissions</span>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-3 flex min-w-0 items-center justify-between gap-2 rounded-lg border border-primary/20 bg-primary/5 p-2.5 sm:mt-4 sm:rounded-xl sm:p-3">
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground sm:size-8">
              <Zap aria-hidden="true" className="size-3.5 sm:size-4" />
            </div>

            <div className="min-w-0 text-[10px] sm:text-xs">
              <p className="truncate font-bold text-foreground">Auto-Quiz Generation Complete</p>

              <p className="truncate text-muted-foreground">12 questions created for Module 4</p>
            </div>
          </div>

          <Button
            size="xs"
            variant="ghost"
            className="shrink-0 px-2 text-[10px] font-bold text-primary sm:text-xs"
          >
            Review
          </Button>
        </div>
      </div>

      {/* Trust Note */}
      <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-border/60 bg-card/40 p-3 backdrop-blur-sm sm:mt-6 sm:items-center sm:gap-3 sm:rounded-2xl sm:p-4">
        <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Check aria-hidden="true" className="size-4 stroke-[2.5]" />
        </div>

        <p className="text-[10px] leading-relaxed text-muted-foreground sm:text-xs">
          <strong className="text-foreground">Built for focus:</strong> Platform manages hosting,
          streaming bandwidth, and payments so you can strictly teach.
        </p>
      </div>
    </div>
  );
}
