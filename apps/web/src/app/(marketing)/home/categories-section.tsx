import Link from 'next/link';
import { ArrowRight, Compass, Sparkles, type LucideIcon } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

import { courseCategories } from './data/categories';

/* ==========================================================================
   TYPES
========================================================================== */

export interface CourseCategory {
  readonly id: string;
  readonly slug: string;
  readonly name: string;
  readonly description: string;
  readonly courseCount: number;
  readonly icon: LucideIcon;
  readonly isPopular?: boolean;
}

/* ==========================================================================
   CATEGORIES SECTION
========================================================================== */

export function CategoriesSection() {
  return (
    <section
      aria-labelledby="categories-heading"
      className="relative overflow-hidden bg-background py-16 sm:py-20 lg:py-28"
    >
      {/* Background Radial Ambient Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-125 w-full max-w-7xl -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent blur-3xl"
      />

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <CategoriesHeader />

        <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:mt-12 lg:grid-cols-4">
          {courseCategories.map((category) => (
            <li key={category.id} className="h-full">
              <CategoryCard category={category} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ==========================================================================
   SECTION HEADER
========================================================================== */

function CategoriesHeader() {
  return (
    <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        <Badge
          variant="outline"
          className="inline-flex items-center gap-2 rounded-full border-primary/20 bg-primary/5 h-6 text-xs font-semibold text-primary backdrop-blur-sm"
        >
          <Compass aria-hidden="true" className="size-3.5 animate-spin-slow" />
          <span>Curated Learning Paths</span>
        </Badge>

        <h2
          id="categories-heading"
          className="mt-4 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl"
        >
          Explore by{' '}
          <span className="bg-linear-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
            category.
          </span>
        </h2>

        <p className="mt-3.5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          Discover structured paths designed to equip you with practical skills across high-demand
          disciplines.
        </p>
      </div>

      <Link
        href="/categories"
        className="group inline-flex items-center gap-2 self-start rounded-xl border border-border/80 bg-card/60 px-4 py-2.5 text-sm font-semibold text-foreground shadow-xs backdrop-blur-md transition-all duration-300 hover:border-primary/30 hover:bg-card hover:text-primary hover:shadow-md sm:self-auto"
      >
        <span>View all categories</span>
        <ArrowRight
          aria-hidden="true"
          className="size-4 transition-transform duration-300 group-hover:translate-x-1"
        />
      </Link>
    </div>
  );
}

/* ==========================================================================
   CATEGORY CARD
========================================================================== */

interface CategoryCardProps {
  category: CourseCategory;
}

function CategoryCard({ category }: CategoryCardProps) {
  const Icon = category.icon;

  return (
    <Link
      href={`/courses?category=${encodeURIComponent(category.slug)}`}
      aria-label={`Explore ${category.name}, ${formatCourseCount(category.courseCount)}`}
      className="group block h-full rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      <Card className="relative flex h-full min-h-55 flex-col justify-between overflow-hidden rounded-2xl border border-border/60 bg-card/50 p-6 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:bg-card hover:shadow-xl hover:shadow-black/5 group-focus-visible:border-ring">
        {/* Popular Tag Indicator */}
        {category.isPopular && (
          <div className="absolute right-4 top-4">
            <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              <Sparkles className="size-2.5" /> Popular
            </span>
          </div>
        )}

        {/* Top Icon & Arrow */}
        <div className="flex items-center justify-between">
          <div className="flex size-12 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary transition-all duration-300 group-hover:scale-105 group-hover:bg-primary group-hover:text-primary-foreground group-hover:shadow-lg group-hover:shadow-primary/20">
            <Icon aria-hidden="true" className="size-6" />
          </div>

          {!category.isPopular && (
            <div
              aria-hidden="true"
              className="flex size-8 items-center justify-center rounded-lg border border-transparent text-muted-foreground transition-all duration-300 group-hover:border-border/60 group-hover:bg-muted/50 group-hover:text-foreground"
            >
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </div>
          )}
        </div>

        {/* Body Description */}
        <div className="mt-6">
          <h3 className="text-lg font-bold tracking-tight text-foreground transition-colors group-hover:text-primary">
            {category.name}
          </h3>

          <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">
            {category.description}
          </p>
        </div>

        {/* Footer Meta */}
        <div className="mt-6 flex items-center justify-between border-t border-border/60 pt-4 text-xs font-semibold">
          <span className="text-muted-foreground transition-colors group-hover:text-foreground">
            {formatCourseCount(category.courseCount)}
          </span>

          <span className="inline-flex items-center gap-1 text-primary">
            <span>Explore</span>
            <ArrowRight
              aria-hidden="true"
              className="size-3 transition-transform duration-300 group-hover:translate-x-0.5"
            />
          </span>
        </div>

        {/* Bottom Hover Progress Line Accent */}
        <div className="absolute inset-x-0 bottom-0 h-0.5 bg-linear-to-r from-transparent via-primary/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </Card>
    </Link>
  );
}

/* ==========================================================================
   FORMATTERS
========================================================================== */

function formatCourseCount(count: number) {
  return `${count.toLocaleString('en-IN')} ${count === 1 ? 'course' : 'courses'}`;
}
