import {
  BookOpen,
  CheckCircle2,
  Compass,
  Dumbbell,
  ArrowRight,
  type LucideIcon,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';

/* ==========================================================================
   TYPES
========================================================================== */

interface JourneyStep {
  readonly id: string;
  readonly number: string;
  readonly title: string;
  readonly description: string;
  readonly icon: LucideIcon;
  readonly highlight: string;
}

/* ==========================================================================
   DATA
========================================================================== */

const JOURNEY_STEPS: readonly JourneyStep[] = [
  {
    id: 'choose',
    number: '01',
    title: 'Choose',
    description:
      'Find a course aligned with your core ambitions, existing baseline, and learning pace.',
    highlight: 'Tailored path',
    icon: Compass,
  },
  {
    id: 'learn',
    number: '02',
    title: 'Learn',
    description:
      'Absorb bite-sized, structured video content and documentation built by industry professionals.',
    highlight: 'Self-paced',
    icon: BookOpen,
  },
  {
    id: 'practice',
    number: '03',
    title: 'Practice',
    description:
      'Translate theoretical concepts into real-world projects with instant automated feedback.',
    highlight: 'Hands-on projects',
    icon: Dumbbell,
  },
  {
    id: 'grow',
    number: '04',
    title: 'Grow',
    description:
      'Earn verifiable certifications, showcase your portfolio, and land your next major career milestone.',
    highlight: 'Career ready',
    icon: CheckCircle2,
  },
];

/* ==========================================================================
   MAIN SECTION
========================================================================== */

export function LearningJourneySection() {
  return (
    <section
      aria-labelledby="learning-journey-heading"
      className="relative overflow-hidden bg-background pb-16 sm:pb-24 lg:pb-32"
    >
      {/* Background glow effects */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 -z-10 h-125 w-full max-w-7xl -translate-x-1/2 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent blur-3xl"
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <JourneyHeader />

        <div className="mt-14 sm:mt-20">
          <ol
            aria-label="StudyHub learning process"
            className="relative grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4 lg:gap-6"
          >
            {JOURNEY_STEPS.map((step, index) => (
              <JourneyStepCard
                key={step.id}
                step={step}
                index={index}
                total={JOURNEY_STEPS.length}
              />
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

/* ==========================================================================
   HEADER
========================================================================== */

function JourneyHeader() {
  return (
    <header className="mx-auto max-w-3xl text-center">
      <Badge
        variant="outline"
        className="inline-flex items-center gap-2 rounded-full border-primary/20 bg-primary/5 h-6 text-xs font-medium text-primary backdrop-blur-sm"
      >
        <Compass aria-hidden="true" className="size-3.5 animate-spin-slow" />
        Structured Roadmap
      </Badge>

      <h2
        id="learning-journey-heading"
        className="mt-6 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl"
      >
        From curiosity to{' '}
        <span className="bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          capability.
        </span>
      </h2>

      <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
        A structured four-step journey designed to transition you seamlessly from fundamental
        understanding to professional execution.
      </p>
    </header>
  );
}

/* ==========================================================================
   STEP CARD
========================================================================== */

interface JourneyStepCardProps {
  step: JourneyStep;
  index: number;
  total: number;
}

function JourneyStepCard({ step, index, total }: JourneyStepCardProps) {
  const Icon = step.icon;
  const isLast = index === total - 1;

  return (
    <li className="group relative flex flex-col justify-between rounded-2xl border border-border/60 bg-card/50 p-6 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:bg-card hover:shadow-md lg:p-7">
      {/* Desktop Horizontal Connecting Line */}
      {!isLast && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-6 top-10 hidden w-6 z-20 items-center justify-center lg:flex"
        >
          <ArrowRight className="size-4 text-muted-foreground/40 transition-colors group-hover:text-primary" />
        </div>
      )}

      <div>
        {/* Top Header Row within Card */}
        <div className="flex items-center justify-between">
          {/* Icon Badge */}
          <div className="flex size-12 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
            <Icon aria-hidden="true" className="size-6" />
          </div>

          {/* Step Number */}
          <span className="text-2xl font-black text-muted-foreground/30 transition-colors group-hover:text-primary/40">
            {step.number}
          </span>
        </div>

        {/* Text Content */}
        <div className="mt-6">
          <Badge
            variant="secondary"
            className="mb-2.5 border-transparent bg-muted text-[11px] font-medium text-muted-foreground transition-colors group-hover:bg-primary/10 group-hover:text-primary"
          >
            {step.highlight}
          </Badge>

          <h3 className="text-xl font-bold tracking-tight text-foreground">{step.title}</h3>

          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.description}</p>
        </div>
      </div>

      {/* Subtle indicator bar on card bottom */}
      <div className="mt-6 h-1 w-8 rounded-full bg-border transition-all duration-300 group-hover:w-full group-hover:bg-primary" />
    </li>
  );
}
