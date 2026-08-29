import Link from 'next/link';
import { ArrowRight, Check, Sparkles } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import { CourseCard } from './course-card';
import { featuredCourses } from './data/featured-courses';

/* ==========================================================================
   TYPES
========================================================================== */

interface DiscoveryFilter {
  readonly label: string;
  readonly value: string;
}

/* ==========================================================================
   DATA
========================================================================== */

const DISCOVERY_FILTERS: readonly DiscoveryFilter[] = [
  { label: 'All courses', value: 'all' },
  { label: 'Development', value: 'web-development' },
  { label: 'Design', value: 'ui-ux-design' },
  { label: 'Business', value: 'business' },
  { label: 'Data', value: 'data-science' },
];

/* ==========================================================================
   FEATURED COURSES SECTION
========================================================================== */

export function FeaturedCoursesSection() {
  return (
    <section
      aria-labelledby="featured-courses-heading"
      className="relative overflow-hidden bg-background pb-16 sm:pb-20 lg:pb-28"
    >
      {/* Background Radial Ambient Lighting */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/3 -z-10 h-150 w-full max-w-7xl -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent blur-3xl"
      />

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <FeaturedCoursesHeader />
        <CourseDiscoveryFilters />
        <CourseGrid />
      </div>
    </section>
  );
}

/* ==========================================================================
   HEADER
========================================================================== */

function FeaturedCoursesHeader() {
  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
      <div className="max-w-2xl">
        <Badge
          variant="outline"
          className="inline-flex items-center gap-2 rounded-full border-primary/20 bg-primary/5 h-6 text-xs font-semibold text-primary backdrop-blur-sm"
        >
          <Sparkles aria-hidden="true" className="size-3.5" />
          <span>Industry-Recognized Curriculum</span>
        </Badge>

        <h2
          id="featured-courses-heading"
          className="mt-4 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl"
        >
          Featured{' '}
          <span className="bg-linear-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
            courses.
          </span>
        </h2>

        <p className="mt-3.5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          Master in-demand skills with step-by-step guidance from industry experts and build
          hands-on portfolio projects.
        </p>
      </div>

      <Link
        href="/courses"
        className="group inline-flex items-center gap-2 self-start rounded-xl border border-border/80 bg-card/60 px-4 py-2.5 text-sm font-semibold text-foreground shadow-xs backdrop-blur-md transition-all duration-300 hover:border-primary/30 hover:bg-card hover:text-primary hover:shadow-md lg:self-auto"
      >
        <span>Explore all courses</span>
        <ArrowRight
          aria-hidden="true"
          className="size-4 transition-transform duration-300 group-hover:translate-x-1"
        />
      </Link>
    </div>
  );
}

/* ==========================================================================
   DISCOVERY FILTERS
========================================================================== */

function CourseDiscoveryFilters() {
  return (
    <nav aria-label="Course categories filter" className="mt-8 lg:mt-10">
      <div className="no-scrollbar overflow-x-auto pb-2 pt-1">
        <div className="flex min-w-max items-center gap-2.5">
          {DISCOVERY_FILTERS.map((filter, index) => (
            <DiscoveryFilterPill key={filter.value} filter={filter} active={index === 0} />
          ))}
        </div>
      </div>
      <div className="mt-4 h-px w-full bg-linear-to-r from-transparent via-border/80 to-transparent" />
    </nav>
  );
}

/* ==========================================================================
   DISCOVERY FILTER PILL
========================================================================== */

interface DiscoveryFilterPillProps {
  filter: DiscoveryFilter;
  active: boolean;
}

function DiscoveryFilterPill({ filter, active }: DiscoveryFilterPillProps) {
  const href =
    filter.value === 'all' ? '/courses' : `/courses?category=${encodeURIComponent(filter.value)}`;

  return (
    <Link
      href={href}
      aria-current={active ? 'page' : undefined}
      className={`inline-flex h-9 shrink-0 items-center gap-2 rounded-full px-4 text-xs font-semibold transition-all duration-300 ${
        active
          ? 'bg-primary text-primary-foreground shadow-md shadow-primary/25 ring-2 ring-primary/20'
          : 'border border-border/60 bg-card/60 text-muted-foreground hover:border-border hover:bg-card hover:text-foreground'
      }`}
    >
      {active && <Check aria-hidden="true" className="size-3.5" />}
      <span>{filter.label}</span>
    </Link>
  );
}

/* ==========================================================================
   COURSE GRID
========================================================================== */

function CourseGrid() {
  if (featuredCourses.length === 0) {
    return <FeaturedCoursesEmptyState />;
  }

  return (
    <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
      {featuredCourses.map((course, index) => (
        <CourseCard key={course.id} course={course} priority={index < 2} />
      ))}
    </div>
  );
}

/* ==========================================================================
   EMPTY STATE
========================================================================== */

function FeaturedCoursesEmptyState() {
  return (
    <div className="mt-10 rounded-2xl border border-dashed border-border/80 bg-card/40 px-6 py-16 text-center backdrop-blur-sm sm:px-10">
      <div className="mx-auto max-w-md">
        <div className="mx-auto flex size-12 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">
          <Sparkles className="size-6" />
        </div>

        <h3 className="mt-4 text-lg font-bold text-foreground">New courses dropping soon</h3>

        <p className="mt-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">
          We are finalizing hands-on modules with world-class instructors. Browse active categories
          in the meantime.
        </p>

        <Button
          variant="outline"
          className="mt-6 rounded-xl border-border/80 bg-card hover:border-primary/30 hover:bg-card hover:text-primary"
        >
          <Link href="/categories" className="inline-flex items-center gap-2">
            <span>Browse Categories</span>
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
