'use client';

import * as React from 'react';
import {
  Award,
  BookOpenCheck,
  Check,
  CheckCircle2,
  Code2,
  Copy,
  GraduationCap,
  LineChart,
  Sparkles,
  TrendingUp,
  type LucideIcon,
} from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

/* ==========================================================================
   TYPES
========================================================================== */

export interface LearningBenefit {
  readonly id: string;
  readonly number: string;
  readonly title: string;
  readonly tag: string;
  readonly description: string;
  readonly icon: LucideIcon;
}

/* ==========================================================================
   CONSTANTS & METRICS
========================================================================== */

const INSTRUCTOR_AVATARS = [
  {
    name: 'Dr. Aris V.',
    role: 'Ex-Google Staff AI Engineer',
    src: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
  },
  {
    name: 'Sarah K.',
    role: 'Principal Architect at Vercel',
    src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
  },
  {
    name: 'Marcus C.',
    role: 'Senior Security Lead',
    src: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
  },
] as const;

/* ==========================================================================
   MAIN SECTION COMPONENT
========================================================================== */

export function WhyStudyHubSection() {
  return (
    <section
      aria-labelledby="why-studyhub-heading"
      className="relative overflow-hidden bg-background pb-20 sm:pb-28 lg:pb-36"
    >
      {/* Ambient Lighting & Canvas Grids */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-125 w-full max-w-7xl -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent blur-3xl opacity-70"
      />

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header Stack */}
        <WhyStudyHubHeader />

        {/* Bento Grid Experience */}
        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-12">
          {/* Card 1: Expert Instructors (Span 7) */}
          <InstructorsBentoCard />

          {/* Card 2: Hands-on Mastery (Span 5) */}
          <HandsOnBentoCard />

          {/* Card 3: Intelligent Progress (Span 5) */}
          <ProgressBentoCard />

          {/* Card 4: Verified Credentials (Span 7) */}
          <CredentialsBentoCard />
        </div>
      </div>
    </section>
  );
}

/* ==========================================================================
   SECTION HEADER
========================================================================== */

function WhyStudyHubHeader() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
      <Badge
        variant="outline"
        className="inline-flex items-center gap-2 rounded-full border-primary/30 bg-primary/5 h-6 text-xs font-semibold text-primary backdrop-blur-md"
      >
        <Sparkles aria-hidden="true" className="size-3.5 text-primary animate-pulse" />
        <span>The StudyHub Advantage</span>
      </Badge>

      <h2
        id="why-studyhub-heading"
        className="mt-6 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl md:text-5xl lg:leading-[1.12]"
      >
        Designed for outcome-driven engineers and{' '}
        <span className="bg-linear-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
          future leaders.
        </span>
      </h2>

      <p className="mt-4 text-base text-muted-foreground sm:text-lg sm:leading-relaxed">
        We stripped away passive videos and endless theory to construct an immersive, high-velocity
        learning environment optimized for career breakthroughs.
      </p>
    </div>
  );
}

/* ==========================================================================
   BENTO CARDS
========================================================================== */

/** Card 1: Expert Instructors */
function InstructorsBentoCard() {
  return (
    <Card className="group relative overflow-hidden border-border/60 bg-card/60 p-4 sm:p-8 shadow-sm backdrop-blur-md transition-all duration-300 hover:border-primary/40 hover:shadow-xl lg:col-span-7">
      <div className="flex flex-col justify-between h-full space-y-8">
        <div>
          <div className="flex items-center justify-between">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-transform group-hover:scale-110">
              <GraduationCap className="size-6" />
            </div>
            <span className="font-mono text-xs font-extrabold tracking-widest text-muted-foreground/60">
              01
            </span>
          </div>

          <h3 className="mt-6 text-2xl font-bold tracking-tight text-foreground">
            Learn directly from real-world practitioners
          </h3>
          <p className="mt-2.5 max-w-lg text-sm leading-relaxed text-muted-foreground sm:text-base">
            Skip outdated academic lectures. Gain direct insights, patterns, and codebases from
            senior engineers actively shaping top tech companies.
          </p>
        </div>

        {/* Dynamic Micro Display */}
        <div className="rounded-2xl border border-border/50 bg-background/50 p-4 backdrop-blur-xs">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">
            Active Mentors From
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            {INSTRUCTOR_AVATARS.map((mentor) => (
              <div
                key={mentor.name}
                className="flex items-center gap-2.5 rounded-xl border border-border/60 bg-card p-2 pr-3 shadow-xs transition-transform hover:-translate-y-0.5"
              >
                <Avatar className="size-7">
                  <AvatarImage src={mentor.src} alt={mentor.name} />
                  <AvatarFallback>{mentor.name[0]}</AvatarFallback>
                </Avatar>
                <div className="text-left">
                  <p className="text-xs font-bold text-foreground leading-none">{mentor.name}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{mentor.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}

/** Card 2: Hands-on Mastery */
function HandsOnBentoCard() {
  return (
    <Card className="group relative overflow-hidden border-border/60 bg-card/60 p-4 sm:p-8 shadow-sm backdrop-blur-md transition-all duration-300 hover:border-primary/40 hover:shadow-xl lg:col-span-5">
      <div className="flex flex-col justify-between h-full space-y-6">
        <div>
          <div className="flex items-center justify-between">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-transform group-hover:scale-110">
              <BookOpenCheck className="size-6" />
            </div>
            <span className="font-mono text-xs font-extrabold tracking-widest text-muted-foreground/60">
              02
            </span>
          </div>

          <h3 className="mt-6 text-2xl font-bold tracking-tight text-foreground">
            Hands-on code execution & reviews
          </h3>
          <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground sm:text-base">
            Write production TypeScript, run CI/CD pipelines, and receive automated PR code reviews
            inside your browser.
          </p>
        </div>

        {/* Visual Code Mockup */}
        <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-950 p-4 font-mono text-xs shadow-md">
          <div className="flex items-center justify-between text-slate-500 border-b border-slate-800 pb-2 mb-3">
            <span className="flex items-center gap-1.5 text-[11px] text-emerald-400">
              <Code2 className="size-3.5" /> app.test.ts
            </span>
            <span className="text-[10px] text-emerald-400/90 font-semibold">✓ Passed (42ms)</span>
          </div>
          <p className="text-slate-400">
            <span className="text-purple-400">test</span>(
            <span className="text-emerald-300">&quot;deploy pipeline&quot;</span>,{' '}
            <span className="text-blue-400">async</span> () =&gt; &#123;
          </p>
          <p className="pl-4 text-slate-300">
            <span className="text-purple-400">const</span> res ={' '}
            <span className="text-purple-400">await</span>{' '}
            <span className="text-blue-400">deploy</span>();
          </p>
          <p className="pl-4 text-slate-300">
            <span className="text-blue-400">expect</span>(res.status).
            <span className="text-blue-400">toBe</span>(<span className="text-amber-300">200</span>
            );
          </p>
          <p className="text-slate-400">&#125;);</p>
        </div>
      </div>
    </Card>
  );
}

/** Card 3: Intelligent Progress */
function ProgressBentoCard() {
  return (
    <Card className="group relative overflow-hidden border-border/60 bg-card/60 sm:p-8 p-4 shadow-sm backdrop-blur-md transition-all duration-300 hover:border-primary/40 hover:shadow-xl lg:col-span-5">
      <div className="flex flex-col justify-between h-full space-y-6">
        <div>
          <div className="flex items-center justify-between">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-transform group-hover:scale-110">
              <LineChart className="size-6" />
            </div>
            <span className="font-mono text-xs font-extrabold tracking-widest text-muted-foreground/60">
              03
            </span>
          </div>

          <h3 className="mt-6 text-2xl font-bold tracking-tight text-foreground">
            Automated learning telemetry
          </h3>
          <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground sm:text-base">
            Track your skill acquisition, diagnostic scores, and weekly velocity with granular
            analytics dashboards.
          </p>
        </div>

        {/* Analytics Card Mockup */}
        <div className="rounded-2xl border border-border/60 bg-background/80 p-4 backdrop-blur-xs">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground font-medium">Weekly Mastery Score</p>
              <p className="text-xl font-extrabold text-foreground mt-0.5">+48.5%</p>
            </div>
            <Badge
              variant="outline"
              className="border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
            >
              <TrendingUp className="mr-1 size-3" /> Top 5%
            </Badge>
          </div>
          {/* Decorative Sparkline Graphic */}
          <div className="mt-4 flex items-end gap-1.5 h-10 w-full">
            <div className="h-4 w-full rounded-xs bg-primary/20" />
            <div className="h-6 w-full rounded-xs bg-primary/30" />
            <div className="h-5 w-full rounded-xs bg-primary/20" />
            <div className="h-8 w-full rounded-xs bg-primary/50" />
            <div className="h-7 w-full rounded-xs bg-primary/40" />
            <div className="h-10 w-full rounded-xs bg-primary" />
          </div>
        </div>
      </div>
    </Card>
  );
}

/** Card 4: Verified Credentials */
function CredentialsBentoCard() {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="group relative overflow-hidden border-border/60 bg-card/60 sm:p-8 p-4 shadow-sm backdrop-blur-md transition-all duration-300 hover:border-primary/40 hover:shadow-xl lg:col-span-7">
      <div className="flex flex-col justify-between h-full space-y-8">
        <div>
          <div className="flex items-center justify-between">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-transform group-hover:scale-110">
              <Award className="size-6" />
            </div>
            <span className="font-mono text-xs font-extrabold tracking-widest text-muted-foreground/60">
              04
            </span>
          </div>

          <h3 className="mt-6 text-2xl font-bold tracking-tight text-foreground">
            Verifiable credentials recognized worldwide
          </h3>
          <p className="mt-2.5 max-w-lg text-sm leading-relaxed text-muted-foreground sm:text-base">
            Every completed learning path generates an cryptographically verifiable certificate
            instantly shareable on LinkedIn and hiring platforms.
          </p>
        </div>

        {/* Certificate Badge Mockup */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-border/60 bg-background/80 p-4 backdrop-blur-xs">
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
              <CheckCircle2 className="size-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-foreground">
                Full-Stack Engineering Certification
              </p>
              <p className="text-[11px] text-muted-foreground">ID: SH-99482-2026</p>
            </div>
          </div>

          <Button
            size="sm"
            variant="secondary"
            onClick={handleCopy}
            className="h-8 rounded-lg text-xs font-semibold gap-1.5 transition-all"
          >
            {copied ? (
              <>
                <Check className="size-3.5 text-emerald-500" /> Copied Link
              </>
            ) : (
              <>
                <Copy className="size-3.5" /> Share Badge
              </>
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
}
