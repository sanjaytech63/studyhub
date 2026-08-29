'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  BookOpen,
  Check,
  Circle,
  Clock3,
  Play,
  PlayCircle,
  Pause,
  SkipBack,
  SkipForward,
  Sparkles,
  Volume2,
  Maximize2,
  Layers,
  Gauge,
  Workflow,
  type LucideIcon,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

/* ==========================================================================
   TYPES & TYPESCRIPT INTERFACES
========================================================================== */

interface CurriculumSection {
  readonly id: string;
  readonly title: string;
  readonly lessons: number;
  readonly completed: boolean;
  readonly active?: boolean;
}

interface ProductBenefit {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly icon: LucideIcon;
}

/* ==========================================================================
   DATA MOCKS
========================================================================== */

const CURRICULUM_SECTIONS: readonly CurriculumSection[] = [
  { id: 'introduction', title: 'Introduction', lessons: 4, completed: true },
  { id: 'react-foundations', title: 'React Foundations', lessons: 6, completed: true },
  { id: 'components', title: 'Building Components', lessons: 5, completed: true },
  { id: 'hooks', title: 'React Hooks Deep Dive', lessons: 4, completed: false, active: true },
  { id: 'state', title: 'State Management Architecture', lessons: 4, completed: false },
  { id: 'nextjs', title: 'Next.js App Router Mastery', lessons: 6, completed: false },
];

const PRODUCT_BENEFITS: readonly ProductBenefit[] = [
  {
    id: 'structured-curriculum',
    title: 'Structured Curriculum',
    description:
      'Clear sequential roadmaps designed to help you track exact milestones and skill progression.',
    icon: Layers,
  },
  {
    id: 'learn-at-your-pace',
    title: 'Cross-Device State Sync',
    description:
      'Seamless synchronization lets you pause, resume, and jump across desktop or mobile instantly.',
    icon: Workflow,
  },
  {
    id: 'track-progress',
    title: 'Real-time Metrics',
    description:
      'Automated milestone analytics and lesson completion metrics calculated inside every module.',
    icon: Gauge,
  },
];

const COURSE_PROGRESS = {
  completedLessons: 18,
  totalLessons: 26,
  percentage: 68,
} as const;

const CURRENT_LESSON = {
  number: 19,
  title: 'Advanced React Hooks Masterclass',
  duration: '24:18',
  description:
    'Understand high-performance custom hook patterns, memoization strategies, and render-optimization techniques in modern production React applications.',
} as const;

/* ==========================================================================
   MAIN SECTION COMPONENT
========================================================================== */

export function LearningExperienceSection() {
  return (
    <section
      aria-labelledby="learning-experience-heading"
      className="relative overflow-hidden bg-background pb-16 sm:pb-24 lg:pb-32"
    >
      {/* Background Ambient Spotlights */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-1/2 -z-10 size-125 -translate-y-1/2 rounded-full bg-primary/10 blur-[140px] opacity-70 dark:opacity-40"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-1/4 -z-10 size-100 rounded-full bg-primary/5 blur-[120px] opacity-50"
      />

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <LearningExperienceHeader />
        <LearningInterfaceShell />
        <ProductBenefitsGrid />
      </div>
    </section>
  );
}

/* ==========================================================================
   SECTION HEADER
========================================================================== */

function LearningExperienceHeader() {
  return (
    <header className="mx-auto max-w-3xl text-center">
      <Badge
        variant="outline"
        className="inline-flex items-center gap-2 rounded-full border-primary/30 bg-primary/5 h-6 text-xs font-semibold text-primary backdrop-blur-md"
      >
        <BookOpen aria-hidden="true" className="size-3.5" />
        <span>Next-Gen Learning Experience</span>
      </Badge>

      <h2
        id="learning-journey-heading"
        className="mt-6 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl"
      >
        Your course.
        <span className="bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Your momentum.
        </span>
      </h2>

      <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
        Designed for focused learning. Enjoy a distraction-free interface complete with inline
        progress tracking, video controls.
      </p>
    </header>
  );
}

/* ==========================================================================
   INTERACTIVE LMS SHELL
========================================================================== */

function LearningInterfaceShell() {
  return (
    <Card className="mt-10 overflow-hidden rounded-3xl border border-border/80 bg-card/80 shadow-2xl backdrop-blur-md sm:mt-12">
      <ShellHeader />
      <div className="grid divide-y divide-border/60 lg:grid-cols-[320px_minmax(0,1fr)] lg:divide-x lg:divide-y-0 xl:grid-cols-[360px_minmax(0,1fr)]">
        <CurriculumSidebar />
        <LessonPlayerArea />
      </div>
    </Card>
  );
}

/* ==========================================================================
   SHELL HEADER
========================================================================== */

function ShellHeader() {
  return (
    <header className="flex flex-col gap-4 border-b border-border/60 bg-muted/20 px-6 py-4.5 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
          <p className="text-[11px] font-bold uppercase tracking-wider text-primary">
            Web Development Career Track
          </p>
        </div>

        <h3 className="mt-0.5 truncate text-base font-bold text-foreground sm:text-lg">
          React &amp; Next.js Enterprise Masterclass
        </h3>
      </div>

      <div className="flex items-center justify-between gap-4 sm:justify-end">
        <div className="flex items-center gap-3">
          <Progress
            value={COURSE_PROGRESS.percentage}
            aria-label={`Overall progress: ${COURSE_PROGRESS.percentage}%`}
            className="h-2 w-24 bg-muted sm:w-32"
          />
          <span className="font-mono text-xs font-bold text-foreground">
            {COURSE_PROGRESS.percentage}%
          </span>
        </div>

        <Button
          variant="outline"
          size="sm"
          className="shrink-0 rounded-xl border-border/80 bg-background/60 font-medium hover:border-primary/40 hover:bg-card"
        >
          <Link href="/dashboard">Dashboard</Link>
        </Button>
      </div>
    </header>
  );
}

/* ==========================================================================
   CURRICULUM SIDEBAR
========================================================================== */

function CurriculumSidebar() {
  return (
    <aside aria-label="Course curriculum breakdown" className="bg-muted/10">
      <div className="border-b border-border/60 p-5">
        <div className="flex items-center justify-between gap-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
            Modules Outline
          </h4>
          <span className="font-mono text-xs font-semibold text-muted-foreground">
            {COURSE_PROGRESS.completedLessons}/{COURSE_PROGRESS.totalLessons} Done
          </span>
        </div>
        <Progress
          value={COURSE_PROGRESS.percentage}
          aria-label="Module status overview"
          className="mt-3 h-1.5 bg-muted"
        />
      </div>

      <nav aria-label="Course modules list" className="max-h-110 overflow-y-auto p-3 lg:max-h-145">
        <ol className="space-y-1.5">
          {CURRICULUM_SECTIONS.map((section, idx) => (
            <CurriculumItem key={section.id} section={section} index={idx + 1} />
          ))}
        </ol>
      </nav>
    </aside>
  );
}

interface CurriculumItemProps {
  section: CurriculumSection;
  index: number;
}

function CurriculumItem({ section, index }: CurriculumItemProps) {
  return (
    <li>
      <button
        type="button"
        aria-current={section.active ? 'step' : undefined}
        className={cn(
          'group relative flex w-full items-start gap-3.5 rounded-2xl p-3.5 text-left transition-all duration-200',
          section.active
            ? 'border border-primary/30 bg-primary/10 shadow-xs'
            : 'border border-transparent hover:bg-muted/60',
        )}
      >
        <CompletionBadge section={section} />

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <span
              className={cn(
                'text-xs font-bold leading-snug',
                section.active
                  ? 'text-primary'
                  : section.completed
                    ? 'text-foreground'
                    : 'text-muted-foreground',
              )}
            >
              0{index}. {section.title}
            </span>

            {section.active && (
              <Badge
                variant="outline"
                className="border-primary/40 bg-primary/10 px-1.5 py-0 text-[10px] text-primary"
              >
                Active
              </Badge>
            )}
          </div>

          <p className="mt-1 text-[11px] font-medium text-muted-foreground">
            {section.lessons} {section.lessons === 1 ? 'lesson' : 'lessons'}
          </p>
        </div>
      </button>
    </li>
  );
}

function CompletionBadge({ section }: { section: CurriculumSection }) {
  if (section.completed) {
    return (
      <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-xs">
        <Check className="size-3 stroke-3" />
      </span>
    );
  }

  if (section.active) {
    return (
      <span className="relative mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border-2 border-primary bg-background">
        <span className="size-2 rounded-full bg-primary animate-pulse" />
      </span>
    );
  }

  return <Circle className="mt-0.5 size-5 shrink-0 text-muted-foreground/30" />;
}

/* ==========================================================================
   LESSON PLAYER & DETAILS AREA
========================================================================== */

function LessonPlayerArea() {
  return (
    <div className="flex flex-col min-w-0 bg-background/50">
      <VideoInteractiveScreen />
      <LessonDetailsSection />
    </div>
  );
}

function VideoInteractiveScreen() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="group relative aspect-video w-full overflow-hidden bg-slate-950">
      {/* Visual Ambient Pattern */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-primary/25 via-transparent to-transparent opacity-60"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px]"
      />

      {/* Main Play Action Button */}
      <div className="absolute inset-0 z-10 flex items-center justify-center">
        <button
          type="button"
          onClick={() => setIsPlaying(!isPlaying)}
          aria-label={isPlaying ? 'Pause lesson video' : 'Play lesson video'}
          className="group/btn relative inline-flex size-16 items-center justify-center rounded-full border border-white/30 bg-black/50 text-white backdrop-blur-md transition-all duration-300 hover:scale-110 hover:border-white hover:bg-black/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:size-20"
        >
          {isPlaying ? (
            <Pause className="size-7 fill-white sm:size-8" />
          ) : (
            <Play className="ml-1 size-7 fill-white transition-transform group-hover/btn:scale-110 sm:size-8" />
          )}
        </button>
      </div>

      {/* Video Overlay Top Controls */}
      <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between p-4 bg-linear-to-b from-black/80 via-black/30 to-transparent">
        <Badge
          variant="outline"
          className="border-white/20 bg-black/40 text-white/90 backdrop-blur-md"
        >
          <span className="mr-1.5 size-2 rounded-full bg-emerald-400" /> 1080p HD
        </Badge>

        <div className="flex items-center gap-1 text-white/80">
          <button
            type="button"
            className="rounded-lg p-2 hover:bg-white/10 hover:text-white transition-colors"
            aria-label="Adjust audio"
          >
            <Volume2 className="size-4" />
          </button>
          <button
            type="button"
            className="rounded-lg p-2 hover:bg-white/10 hover:text-white transition-colors"
            aria-label="Toggle Fullscreen"
          >
            <Maximize2 className="size-4" />
          </button>
        </div>
      </div>

      {/* Video Overlay Bottom Bar */}
      <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col gap-2 bg-linear-to-t from-black/90 via-black/50 to-transparent p-4 sm:p-6">
        <div className="flex items-end justify-between gap-4 text-white">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-primary">
              Lesson {CURRENT_LESSON.number}
            </p>
            <p className="mt-0.5 font-bold text-sm sm:text-base">{CURRENT_LESSON.title}</p>
          </div>

          <span className="inline-flex shrink-0 items-center gap-1.5 font-mono text-xs text-white/90 bg-white/10 px-2.5 py-1 rounded-md backdrop-blur-md">
            <Clock3 className="size-3.5" />
            {CURRENT_LESSON.duration}
          </span>
        </div>

        {/* Video Scrubber Visual Line */}
        <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-white/20">
          <div className="h-full w-1/3 rounded-full bg-primary" />
        </div>
      </div>
    </div>
  );
}

function LessonDetailsSection() {
  return (
    <div className="flex flex-col justify-between p-6 sm:p-8">
      <div>
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-primary">
              Module Overview
            </span>
            <h4 className="mt-1 text-xl font-bold text-foreground sm:text-2xl">
              {CURRENT_LESSON.title}
            </h4>
          </div>

          <div className="hidden size-10 shrink-0 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary sm:flex">
            <Sparkles className="size-5" />
          </div>
        </div>

        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          {CURRENT_LESSON.description}
        </p>
      </div>

      <Separator className="my-6 bg-border/60" />

      {/* Control Actions Bottom Toolbar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2" aria-label="Lesson player navigation controls">
          <Button
            variant="outline"
            size="icon"
            className="size-10 rounded-xl"
            aria-label="Previous lesson"
          >
            <SkipBack className="size-4" />
          </Button>
          <Button
            variant="default"
            size="icon"
            className="size-10 rounded-xl shadow-md shadow-primary/20"
            aria-label="Play/Pause lesson"
          >
            <PlayCircle className="size-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="size-10 rounded-xl"
            aria-label="Next lesson"
          >
            <SkipForward className="size-4" />
          </Button>
        </div>

        <Button size="lg" className="h-11 rounded-xl font-semibold shadow-md shadow-primary/20">
          <Link href="/dashboard" className="inline-flex items-center gap-2">
            <span>Continue Next Lesson</span>
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}

/* ==========================================================================
   PRODUCT BENEFITS GRID
========================================================================== */

function ProductBenefitsGrid() {
  return (
    <div className="mt-8 grid gap-6 sm:grid-cols-3">
      {PRODUCT_BENEFITS.map((benefit) => {
        const Icon = benefit.icon;

        return (
          <Card
            key={benefit.id}
            className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card/60 p-6 backdrop-blur-md transition-all duration-300 hover:border-primary/40 hover:bg-card hover:shadow-xl"
          >
            <div className="flex items-center gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary transition-transform group-hover:scale-110">
                <Icon className="size-5" />
              </div>
              <h3 className="text-base font-bold text-foreground">{benefit.title}</h3>
            </div>

            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {benefit.description}
            </p>

            {/* Hover Gradient Accent Line */}
            <div className="absolute inset-x-0 top-0 h-0.5 bg-linear-to-r from-transparent via-primary/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </Card>
        );
      })}
    </div>
  );
}
