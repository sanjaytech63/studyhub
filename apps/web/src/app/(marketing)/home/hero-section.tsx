'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  BookOpen,
  BrainCircuit,
  Check,
  CheckCircle2,
  Clock,
  Code2,
  Cpu,
  Layers,
  Play,
  Server,
  ShieldCheck,
  Star,
  Users,
} from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

/* ============================================================================
   CONSTANTS & CONFIG
============================================================================ */

const SOCIAL_PROOF_AVATARS = [
  {
    name: 'Sarah Chen',
    company: 'Stripe',
    src: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
  },
  {
    name: 'Marcus Vance',
    company: 'Vercel',
    src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
  },
  {
    name: 'Elena Rostova',
    company: 'Meta',
    src: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
  },
  {
    name: 'Devin Patel',
    company: 'Google',
    src: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
  },
] as const;

const TOP_COMPANIES = ['Google', 'Meta', 'Stripe', 'Vercel', 'Netflix', 'OpenAI'] as const;

/* ============================================================================
   MAIN HERO SECTION
============================================================================ */

export function HeroSection() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative isolate overflow-hidden border-b border-border/50 bg-background pt-12 pb-20 sm:pt-16 sm:pb-28 lg:pt-20 lg:pb-32"
    >
      {/* Dynamic Background Atmosphere */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden select-none"
      >
        <div className="absolute inset-0 bg-[radial-gradient(var(--border)_1px,transparent_1px)] [background-size:28px_28px] opacity-70 [mask-image:radial-gradient(ellipse_75%_60%_at_50%_15%,#000_65%,transparent_100%)]" />
        {/* <div className="absolute -top-32 left-1/2 -z-10 h-[580px] w-[900px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-primary/25 via-violet-600/15 to-indigo-500/10 blur-[150px] dark:from-primary/30 dark:via-violet-500/20" /> */}
        <div className="absolute top-1/2 -left-40 -z-10 h-96 w-96 rounded-full bg-primary/10 blur-[140px]" />
        <div className="absolute top-1/3 -right-40 -z-10 h-96 w-96 rounded-full bg-indigo-500/10 blur-[140px]" />
      </div>

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Balanced 50/50 Layout Grid (lg:grid-cols-12 split evenly into col-span-6) */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
          {/* LEFT COLUMN: High-Impact Hero Typography & CTAs (50%) */}
          <div className="flex flex-col items-start text-left lg:col-span-6 pt-10">
            <Link
              href="/courses"
              className="group mb-6 inline-flex items-center gap-2.5 rounded-full border border-primary/25 bg-primary/5 px-4 py-1.5 text-xs font-semibold text-primary shadow-xs backdrop-blur-md transition-all hover:border-primary/45 hover:bg-primary/10 hover:shadow-primary/15"
            >
              <span className="relative flex size-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
              </span>
              <span>StudyHub Academy • Live Cohorts & On-Demand Tracks</span>
              <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>

            <h1
              id="hero-heading"
              className="text-4xl font-black tracking-tight text-foreground capitalize sm:text-3xl lg:text-4xl xl:text-5xl lg:leading-[1.08]"
            >
              The high-output way to master{' '}
              <span className="inline-block bg-gradient-to-r from-primary via-violet-500 to-indigo-400 bg-clip-text text-transparent">
                production engineering.
              </span>
            </h1>

            <p className="mt-6 text-base leading-relaxed text-muted-foreground sm:text-lg sm:leading-relaxed">
              Skip passive 30-hour video tutorials. Master real-world cloud architectures, system
              design, and AI infrastructure with production-ready projects and live instructor
              guidance.
            </p>

            <div className="mt-8 flex w-full flex-col gap-3.5 sm:flex-row">
              <Button
                asChild
                className="group h-13 w-full rounded-2xl px-8 text-base font-bold shadow-xl shadow-primary/25 transition-all hover:scale-[1.02] active:scale-[0.98] sm:w-auto"
              >
                <Link href="/courses">
                  <span>Explore All Courses</span>
                  <ArrowRight className="size-4.5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="h-13 w-full rounded-2xl border-border/80 bg-background/70 px-7 text-base font-semibold backdrop-blur-md hover:bg-muted/60 sm:w-auto"
              >
                <Link href="/demo" className="inline-flex items-center gap-2">
                  <Play className="size-4 fill-primary text-primary" />
                  <span>Preview Free Lesson</span>
                </Link>
              </Button>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-medium text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="size-3.5 text-emerald-500" />
                <span>7-Day Risk-Free Trial</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="size-3.5 text-emerald-500" />
                <span>Self-Paced & Live Option</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="size-3.5 text-primary" />
                <span>Verified Certificate</span>
              </span>
            </div>

            <div className="mt-8 flex flex-col items-start gap-4 border-t border-border/60 pt-6 sm:flex-row sm:items-center sm:gap-5">
              <div className="flex shrink-0 -space-x-3">
                {SOCIAL_PROOF_AVATARS.map((user) => (
                  <Avatar
                    key={user.name}
                    className="size-9 border-2 border-background shadow-xs transition-transform hover:z-10 hover:scale-110"
                  >
                    <AvatarImage src={user.src} alt={user.name} />
                    <AvatarFallback className="bg-primary/10 text-xs font-bold text-primary">
                      {user.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                ))}
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="size-3.5 fill-current" />
                    ))}
                  </div>
                  <span className="text-xs font-black text-foreground">4.96 / 5.0</span>
                  <span className="text-[11px] text-muted-foreground">• 18,400+ graduates</span>
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Graduates hired at{' '}
                  <span className="font-semibold text-foreground">
                    {TOP_COMPANIES.slice(0, 4).join(', ')}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Modern Course Platform Showcase (50%) */}
          <div className="lg:col-span-6">
            <CoursePlatformShowcase />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================================
   COURSE PLATFORM SHOWCASE COMPONENT (MERN, AWS, Production, AI/ML)
============================================================================ */

const TRACK_HIGHLIGHTS = [
  {
    id: 'mern-stack',
    tabLabel: 'MERN Stack',
    title: 'Full-Stack MERN Architecture',
    level: 'Intermediate',
    duration: '8 Weeks',
    modules: 12,
    enrolled: '6.4k students',
    instructor: 'Alex Rivera (Ex-Meta SDE)',
    icon: Code2,
    highlights: [
      'React 19 & Next.js App Router',
      'Node.js Cluster & Express APIs',
      'MongoDB Aggregations & Redis Cache',
    ],
  },
  {
    id: 'aws-cloud',
    tabLabel: 'AWS Cloud',
    title: 'AWS Cloud Architecture & DevOps',
    level: 'Advanced',
    duration: '10 Weeks',
    modules: 16,
    enrolled: '5.2k students',
    instructor: 'Dan Miller (Principal AWS Architect)',
    icon: Server,
    highlights: [
      'Terraform Infrastructure as Code',
      'AWS ECS, EKS & Lambda Serverless',
      'Multi-Region VPC & Security Compliance',
    ],
  },
  {
    id: 'production-eng',
    tabLabel: 'Production Eng',
    title: 'Production Systems & Reliability',
    level: 'Advanced',
    duration: '6 Weeks',
    modules: 10,
    enrolled: '4.8k students',
    instructor: 'Elena Rostova (Staff SRE at Netflix)',
    icon: Cpu,
    highlights: [
      'Kubernetes Orchestration & Helm',
      'Prometheus & Grafana Observability',
      'Zero-Downtime CI/CD Pipelines',
    ],
  },
  {
    id: 'ai-ml-infra',
    tabLabel: 'AI / ML Infra',
    title: 'AI Infrastructure & LLM Systems',
    level: 'Advanced',
    duration: '8 Weeks',
    modules: 14,
    enrolled: '3.9k students',
    instructor: 'Dr. Priya Sharma (AI Research Lead)',
    icon: BrainCircuit,
    highlights: [
      'Vector Databases & RAG Pipelines',
      'GPU Cluster Acceleration & PyTorch',
      'vLLM Production Model Deployment',
    ],
  },
] as const;

function CoursePlatformShowcase() {
  const [selectedTrack, setSelectedTrack] = React.useState<string>('mern-stack');

  const activeTrack = TRACK_HIGHLIGHTS.find((t) => t.id === selectedTrack) ?? TRACK_HIGHLIGHTS[0];

  return (
    <Card className="group relative overflow-hidden rounded-3xl border border-border/80 bg-card/90 p-5 shadow-2xl shadow-primary/5 backdrop-blur-2xl transition-all hover:border-border sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <BookOpen className="size-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-card-foreground">StudyHub Learning Engine</h3>
            <p className="text-xs text-muted-foreground">Specialized Technical Tracks</p>
          </div>
        </div>
        <Badge className="border-emerald-500/20 bg-emerald-500/10 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
          ● Cohort Enrolling Now
        </Badge>
      </div>

      {/* Dynamic Tab Selection for standard tracks */}
      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {TRACK_HIGHLIGHTS.map((track) => {
          const IconComponent = track.icon;
          const isSelected = selectedTrack === track.id;
          return (
            <button
              key={track.id}
              type="button"
              onClick={() => setSelectedTrack(track.id)}
              className={cn(
                'flex items-center justify-center gap-1.5 rounded-xl px-2.5 py-2.5 text-xs font-semibold transition-all',
                isSelected
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground',
              )}
            >
              <IconComponent className="size-3.5 shrink-0" />
              <span className="truncate">{track.tabLabel}</span>
            </button>
          );
        })}
      </div>

      {/* Selected Track Details Preview */}
      <div className="mt-5 rounded-2xl border border-border/70 bg-muted/30 p-4 sm:p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <Badge
              variant="outline"
              className="border-primary/30 text-[11px] font-medium text-primary"
            >
              {activeTrack.level} Track
            </Badge>
            <h4 className="mt-2 text-base font-bold text-foreground sm:text-lg">
              {activeTrack.title}
            </h4>
            <p className="mt-1 text-xs text-muted-foreground">
              Led by <span className="font-semibold text-foreground">{activeTrack.instructor}</span>
            </p>
          </div>

          <Button size="sm" className="rounded-xl font-bold shadow-md">
            <span>Explore Track</span>
            <ArrowRight className="ml-1.5 size-3.5" />
          </Button>
        </div>

        {/* Feature Highlights Grid */}
        <div className="mt-4 space-y-2 border-t border-border/50 pt-3.5">
          <p className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
            Key Curriculum Focus
          </p>
          <div className="grid grid-cols-1 gap-2 text-xs text-foreground">
            {activeTrack.highlights.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <Check className="size-3.5 text-emerald-500 shrink-0" />
                <span className="font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Track Specs */}
        <div className="mt-4 grid grid-cols-3 gap-2 border-t border-border/50 pt-3.5 text-xs">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Clock className="size-3.5 text-primary" />
            <span>{activeTrack.duration}</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Layers className="size-3.5 text-primary" />
            <span>{activeTrack.modules} Modules</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Users className="size-3.5 text-primary" />
            <span>{activeTrack.enrolled}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
