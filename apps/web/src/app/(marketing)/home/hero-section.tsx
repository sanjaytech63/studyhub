'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  Code2,
  Play,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
  Zap,
} from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

/* ============================================================================
   CONSTANTS & CONFIG
============================================================================ */

const HERO_BENEFITS = [
  {
    label: 'Self-paced learning',
    icon: Zap,
  },
  {
    label: 'Industry-vetted curriculum',
    icon: ShieldCheck,
  },
  {
    label: 'Certificate of completion',
    icon: Award,
  },
] as const;

const COMMUNITY_AVATARS = [
  {
    name: 'Sarah L.',
    src: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
  },
  {
    name: 'Alex M.',
    src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
  },
  {
    name: 'Elena R.',
    src: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
  },
  {
    name: 'David K.',
    src: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
  },
] as const;

/* ============================================================================
   MAIN HERO SECTION
============================================================================ */

export function HeroSection() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative overflow-hidden border-b border-border/40 bg-background py-10 sm:py-14 md:py-16 lg:py-24 xl:py-28"
    >
      {/* Ambient lighting */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 -top-32 -z-10 size-72 rounded-full bg-primary/10 blur-[100px] opacity-70 dark:opacity-40 sm:-left-48 sm:-top-48 sm:size-100 sm:blur-[140px]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 top-1/3 -z-10 size-72 rounded-full bg-primary/10 blur-[100px] opacity-60 dark:opacity-30 sm:-right-48 sm:size-100 sm:blur-[160px]"
      />

      {/* Container */}
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 md:gap-12 lg:grid-cols-12 lg:gap-8 xl:gap-16">
          {/* Left column */}
          <div className="min-w-0 lg:col-span-6">
            <HeroCopySection />
          </div>

          {/* Right column */}
          <div className="min-w-0 w-full lg:col-span-6">
            <InteractivePlatformPreview />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================================
   HERO COPY & BRAND SECTION
============================================================================ */

function HeroCopySection() {
  return (
    <div className="flex min-w-0 flex-col items-start pt-0 text-left">
      {/* Eyebrow */}
      <Badge className="mb-5 h-auto max-w-full gap-1.5 border-primary/30 bg-primary/5 px-2.5 py-1 text-[10px] font-semibold leading-tight text-primary backdrop-blur-md sm:mb-6 sm:text-xs">
        <Sparkles className="size-3 shrink-0 animate-pulse sm:size-3.5" />

        <span className="truncate">Next-Generation Interactive Learning Platform</span>
      </Badge>

      {/* Hero title */}
      <h1
        id="hero-heading"
        className="max-w-3xl text-3xl  font-extrabold leading-[1.08] tracking-[-0.035em] text-foreground min-[375px]:text-[2.35rem] sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl xl:leading-[1.06]"
      >
        Master key skills.{' '}
        <span className="bg-linear-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
          Build real projects.
        </span>
      </h1>

      {/* Subtitle */}
      <p className="mt-5 max-w-2xl text-sm leading-6 text-muted-foreground sm:mt-6 sm:text-base sm:leading-7 md:text-lg md:leading-relaxed">
        Join over 50,000+ developers and designers building production-grade skills through hands-on
        project tutorials and expert mentorship.
      </p>

      {/* CTA buttons */}
      <div className="mt-7 grid w-full grid-cols-1 gap-3 min-[400px]:grid-cols-2 sm:flex sm:w-auto sm:flex-row sm:items-center">
        <Button
          size="lg"
          className="h-12 w-full rounded-xl px-5 text-sm font-semibold shadow-lg shadow-primary/25 transition-all active:scale-[0.98] min-[400px]:px-6 sm:w-auto sm:px-7"
        >
          <Link href="/courses" className="flex w-full items-center justify-center gap-2">
            Start Learning Now
            <ArrowRight className="size-4 shrink-0" />
          </Link>
        </Button>

        <Button
          variant="outline"
          size="lg"
          className="h-12 w-full rounded-xl border-border/80 px-5 text-sm font-semibold transition-all hover:bg-muted/60 active:scale-[0.98] min-[400px]:px-6 sm:w-auto"
        >
          <Link href="/curriculum" className="flex items-center justify-center">
            View Curriculum
          </Link>
        </Button>
      </div>

      {/* Social proof */}
      <div className="mt-8 flex flex-col md:flex-row w-full items-center gap-3 border-t border-border/50 pt-6 sm:mt-10 sm:gap-4 sm:pt-8">
        {/* Avatars */}
        <div className="flex shrink-0 -space-x-2.5">
          {COMMUNITY_AVATARS.map((user) => (
            <Avatar
              key={user.name}
              className="size-8 border-2 border-background shadow-xs sm:size-9"
            >
              <AvatarImage src={user.src} alt={user.name} />

              <AvatarFallback className="bg-primary/10 text-xs font-bold text-primary">
                {user.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
          ))}
        </div>

        {/* Rating */}
        <div className="min-w-0">
          <div className="flex items-center gap-1 text-xs font-bold text-foreground sm:text-sm">
            <div className="flex shrink-0 text-amber-400">
              {[...Array(5)].map((_, index) => (
                <Star key={index} className="size-3 fill-current sm:size-3.5" />
              ))}
            </div>

            <span className="ml-0.5 whitespace-nowrap">4.9/5 Rating</span>
          </div>

          <p className="truncate text-[11px] text-muted-foreground sm:text-xs">
            Trusted by 50k+ students worldwide
          </p>
        </div>
      </div>

      {/* Trust benefits */}
      <div className="mt-5 grid w-full grid-cols-1 justify-items-center gap-2.5 text-xs font-medium text-muted-foreground min-[400px]:grid-cols-2 sm:flex sm:flex-wrap sm:justify-start sm:gap-x-6 sm:gap-y-2">
        {HERO_BENEFITS.map(({ label, icon: Icon }) => (
          <div key={label} className="inline-flex items-center justify-center gap-1.5">
            <Icon className="size-3.5 shrink-0 text-primary" />
            <span>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================================
   INTERACTIVE PLATFORM PREVIEW
============================================================================ */

function InteractivePlatformPreview() {
  const [activeTab, setActiveTab] = React.useState<'code' | 'video' | 'project'>('code');

  return (
    <div className="relative mx-auto w-full min-w-0 max-w-xl lg:max-w-none">
      {/* Active student badge */}
      <div className="absolute -right-3 -top-5 z-20 hidden rounded-2xl border border-border/60 bg-card/95 p-3 shadow-xl backdrop-blur-md md:flex md:items-center md:gap-3 lg:-right-4 lg:-top-6 lg:p-3.5">
        <div className="flex size-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500 lg:size-10">
          <Users className="size-4.5 lg:size-5" />
        </div>

        <div>
          <p className="text-xs font-bold text-card-foreground">1,240 Active Now</p>

          <p className="text-[10px] text-muted-foreground lg:text-[11px]">
            Learning Next.js & React
          </p>
        </div>
      </div>

      {/* Course completion badge */}
      <div className="absolute -bottom-5 -left-3 z-20 hidden rounded-2xl border border-border/60 bg-card/95 p-3 shadow-xl backdrop-blur-md md:flex md:items-center md:gap-3 lg:-bottom-6 lg:-left-4 lg:p-3.5">
        <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary lg:size-10">
          <CheckCircle2 className="size-4.5 lg:size-5" />
        </div>

        <div>
          <p className="text-xs font-bold text-card-foreground">Course Completed</p>

          <p className="text-[10px] font-medium text-muted-foreground dark:text-emerald-400 lg:text-[11px]">
            + Verified Certificate
          </p>
        </div>
      </div>

      {/* Main studio card */}
      <Card className="relative w-full min-w-0 overflow-hidden rounded-2xl border border-border/80 bg-card/90 shadow-2xl shadow-black/10 backdrop-blur-md sm:rounded-3xl">
        {/* App header */}
        <div className="flex min-w-0 items-center justify-between gap-2 border-b border-border/60 bg-muted/30 px-3 py-2.5 sm:px-5 sm:py-3.5">
          {/* Browser dots */}
          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            <span className="size-2 rounded-full bg-rose-500/80 sm:size-3" />
            <span className="size-2 rounded-full bg-amber-500/80 sm:size-3" />
            <span className="size-2 rounded-full bg-emerald-500/80 sm:size-3" />
          </div>

          {/* Tabs */}
          <div className="flex min-w-0 max-w-full overflow-x-auto rounded-lg border border-border/60 bg-background/60 p-0.5 backdrop-blur-xs scrollbar-none [&::-webkit-scrollbar]:hidden sm:p-1">
            {/* Code */}
            <button
              type="button"
              onClick={() => setActiveTab('code')}
              className={`flex shrink-0 items-center gap-1 rounded-md px-2 py-1 text-[10px] font-medium transition-all sm:gap-1.5 sm:px-3 sm:text-xs ${activeTab === 'code' ? 'bg-primary text-primary-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <Code2 className="size-3 sm:size-3.5" />
              <span>Code</span>
            </button>

            {/* Video */}
            <button
              type="button"
              onClick={() => setActiveTab('video')}
              className={`flex shrink-0 items-center gap-1 rounded-md px-2 py-1 text-[10px] font-medium transition-all sm:gap-1.5 sm:px-3 sm:text-xs ${activeTab === 'video' ? 'bg-primary text-primary-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <Play className="size-3 sm:size-3.5" />
              <span>Video</span>
            </button>

            {/* Project */}
            <button
              type="button"
              onClick={() => setActiveTab('project')}
              className={`flex shrink-0 items-center gap-1 rounded-md px-2 py-1 text-[10px] font-medium transition-all sm:gap-1.5 sm:px-3 sm:text-xs ${activeTab === 'project' ? 'bg-primary text-primary-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <BookOpen className="size-3 sm:size-3.5" />
              <span>Project</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <CardContent className="min-w-0 p-0">
          {activeTab === 'code' && <CodeStudioTab />}
          {activeTab === 'video' && <VideoLessonTab />}
          {activeTab === 'project' && <ProjectOutputTab />}
        </CardContent>
      </Card>
    </div>
  );
}

/* ============================================================================
   CODE STUDIO TAB
============================================================================ */

function CodeStudioTab() {
  return (
    <div className="min-w-0 overflow-hidden bg-slate-950 p-3 font-mono text-[10px] text-slate-200 sm:p-5 sm:text-xs">
      {/* File header */}
      <div className="flex min-w-0 items-center justify-between gap-3 border-b border-slate-800 pb-2.5 text-slate-400 sm:pb-3">
        <span className="flex min-w-0 shrink-0 items-center gap-2">
          <span className="text-emerald-400">●</span>

          <span className="truncate">hero-component.tsx</span>
        </span>

        <span className="hidden shrink-0 text-[10px] text-slate-500 sm:block">
          TypeScript / Next.js
        </span>
      </div>

      {/* Code */}
      <pre className="mt-3 max-w-full overflow-x-auto text-[10px] leading-[1.7] sm:mt-4 sm:text-xs sm:leading-relaxed">
        <code>
          <span className="text-purple-400">export default function</span>{' '}
          <span className="text-blue-400">CourseApp</span>
          () &#123;
          <br />
          &nbsp;&nbsp;
          <span className="text-purple-400">const</span> [skills, setSkills] ={' '}
          <span className="text-blue-400">useLearningState</span>
          ();
          <br />
          <br />
          &nbsp;&nbsp;
          <span className="text-purple-400">return</span> (
          <br />
          &nbsp;&nbsp;&nbsp;&nbsp;&lt;
          <span className="text-rose-400">InteractiveCanvas</span>
          <br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; level=
          <span className="text-emerald-300">Production</span>
          <br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; realtime=
          <span className="text-amber-300">&#123;true&#125;</span>
          <br />
          &nbsp;&nbsp;&nbsp;&nbsp;&gt;
          <br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;
          <span className="text-rose-400">ProjectBuild</span> /&gt;
          <br />
          &nbsp;&nbsp;&nbsp;&nbsp;&lt;/
          <span className="text-rose-400">InteractiveCanvas</span>
          &gt;
          <br />
          &nbsp;&nbsp;);
          <br />
          &#125;
        </code>
      </pre>
    </div>
  );
}

/* ============================================================================
   VIDEO LESSON TAB
============================================================================ */

function VideoLessonTab() {
  return (
    <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
      <Image
        src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200"
        alt="Interactive Lesson Preview"
        fill
        sizes="(max-width: 1024px) 100vw, 600px"
        className="object-cover opacity-60"
      />

      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/40 px-4 text-center backdrop-blur-xs sm:gap-3">
        {/* Play button */}
        <span className="flex size-12 items-center justify-center rounded-full bg-primary/90 text-primary-foreground shadow-2xl transition-transform hover:scale-110 sm:size-16">
          <Play className="ml-0.5 size-5 fill-current sm:ml-1 sm:size-7" />
        </span>

        {/* Lesson title */}
        <span className="max-w-[90%] text-[10px] font-semibold leading-4 text-white sm:text-xs">
          Lesson 4: Building Scalable Architecture
        </span>
      </div>
    </div>
  );
}

/* ============================================================================
   PROJECT OUTPUT TAB
============================================================================ */

function ProjectOutputTab() {
  return (
    <div className="space-y-3 bg-card p-3 sm:space-y-4 sm:p-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 border-b border-border/60 pb-3">
        <span className="min-w-0 truncate text-[11px] font-bold text-card-foreground sm:text-xs">
          Full-Stack SaaS Platform
        </span>

        <Badge
          variant="outline"
          className="shrink-0 border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[9px] text-emerald-600 dark:text-emerald-400"
        >
          Live Build
        </Badge>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 gap-2 sm:gap-3">
        {/* Test coverage */}
        <div className="rounded-lg border border-border/60 bg-muted/30 p-2.5 sm:rounded-xl sm:p-3">
          <p className="text-[10px] text-muted-foreground sm:text-[11px]">Test Coverage</p>

          <p className="mt-0.5 text-sm font-extrabold text-card-foreground sm:text-base">98.4%</p>
        </div>

        {/* Performance */}
        <div className="rounded-lg border border-border/60 bg-muted/30 p-2.5 sm:rounded-xl sm:p-3">
          <p className="text-[10px] text-muted-foreground sm:text-[11px]">Performance Score</p>

          <p className="mt-0.5 text-sm font-extrabold text-emerald-500 sm:text-base">100/100</p>
        </div>
      </div>
    </div>
  );
}
