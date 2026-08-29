import { BookOpen, GraduationCap, Star, Users, type LucideIcon } from 'lucide-react';

import { Card } from '@/components/ui/card';

/* ========================================================================
   TYPES
======================================================================== */

interface TrustMetric {
  readonly id: string;
  readonly value: string;
  readonly label: string;
  readonly subtext: string;
  readonly icon: LucideIcon;
}

/* ========================================================================
   DATA
======================================================================== */

const TRUST_METRICS: readonly TrustMetric[] = [
  {
    id: 'learners',
    value: '50K+',
    label: 'Active Learners',
    subtext: 'Across 120+ countries',
    icon: Users,
  },
  {
    id: 'courses',
    value: '500+',
    label: 'Practical Courses',
    subtext: 'Updated weekly',
    icon: BookOpen,
  },
  {
    id: 'instructors',
    value: '100+',
    label: 'Expert Mentors',
    subtext: 'Top industry veterans',
    icon: GraduationCap,
  },
  {
    id: 'rating',
    value: '4.8',
    label: 'Average Rating',
    subtext: 'From 15K+ reviews',
    icon: Star,
  },
];

/* ========================================================================
   TRUST STRIP
======================================================================== */

export function TrustStrip() {
  return (
    <section
      aria-label="StudyHub platform statistics"
      className="relative overflow-hidden border-b border-border/60 bg-background/50 py-6 backdrop-blur-xl sm:py-8 lg:py-10"
    >
      {/* Background Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-40 w-[90%] max-w-5xl -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-3xl"
      />

      <div className="mx-auto w-full max-w-7xl px-3 sm:px-6 lg:px-8">
        <Card className="overflow-hidden rounded-2xl border-border/80 bg-card/60 shadow-lg shadow-black/5 backdrop-blur-md">
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {TRUST_METRICS.map((metric) => (
              <TrustMetricItem key={metric.id} metric={metric} />
            ))}
          </ul>
        </Card>
      </div>
    </section>
  );
}

/* ========================================================================
   TRUST METRIC ITEM
======================================================================== */

interface TrustMetricItemProps {
  readonly metric: TrustMetric;
}

function TrustMetricItem({ metric }: TrustMetricItemProps) {
  const Icon = metric.icon;
  const isRating = metric.id === 'rating';

  return (
    <li className="group flex min-w-0 flex-col items-center justify-center gap-2 border-b border-border/60 p-5 text-center transition-colors duration-300 hover:bg-muted/30 last:border-b-0 sm:flex-row sm:justify-start sm:gap-3.5 sm:p-5 sm:text-left sm:nth-[2n]:border-b-0 sm:nth-[2n+1]:border-r lg:border-b-0 lg:border-r lg:p-6 lg:last:border-r-0">
      {/* Icon */}
      <div
        aria-hidden="true"
        className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary transition-all duration-300 group-hover:scale-105 group-hover:border-primary/40 group-hover:bg-primary group-hover:text-primary-foreground group-hover:shadow-lg group-hover:shadow-primary/20 sm:size-11 lg:size-12"
      >
        <Icon className="size-4.5 sm:size-5 lg:size-6" />
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1 text-center sm:text-left">
        {/* Value */}
        <div className="flex items-center justify-center gap-1.5 sm:justify-start">
          <span className="text-[22px] font-black leading-none tracking-tight text-foreground sm:text-2xl lg:text-3xl">
            {metric.value}
          </span>

          {isRating && (
            <Star
              aria-hidden="true"
              className="size-3.5 shrink-0 fill-amber-400 text-amber-400 sm:size-4"
            />
          )}
        </div>

        {/* Label */}
        <p className="mt-1 truncate text-xs font-semibold leading-tight text-foreground/90 sm:text-sm">
          {metric.label}
        </p>

        {/* Supporting Text */}
        <p className="mt-1 truncate text-[10px] leading-tight text-muted-foreground sm:text-xs">
          {metric.subtext}
        </p>
      </div>
    </li>
  );
}
