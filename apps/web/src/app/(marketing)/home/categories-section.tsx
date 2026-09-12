'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Compass,
  Sparkles,
  Code2,
  Server,
  Cloud,
  Cpu,
  Database,
  Palette,
  Layers,
  type LucideIcon,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

import { useCategories } from '@/lib/courses/course.queries';

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

const CATEGORY_ICON_MAP: Record<string, LucideIcon> = {
  'full-stack-and-web': Code2,
  'system-design-and-microservices': Server,
  'cloud-devops-and-kubernetes': Cloud,
  'data-engineering-and-kafka': Database,
  'ai-and-applied-machine-learning': Cpu,
  'mobile-app-engineering': Layers,
  'ui-ux-design-systems': Palette,
};

/* ==========================================================================
   CATEGORIES SECTION
========================================================================== */

export function CategoriesSection() {
  const { data: rawCategories, isLoading } = useCategories();

  const categories: CourseCategory[] = useMemo(() => {
    if (!rawCategories || rawCategories.length === 0) return [];

    return rawCategories.map((cat, idx) => ({
      id: cat.id,
      slug: cat.slug || cat.id,
      name: cat.name,
      description:
        cat.description || 'Master hands-on engineering skills with real-world architecture.',
      courseCount: (cat as unknown as { _count?: { courses?: number } })._count?.courses ?? 0,
      icon: CATEGORY_ICON_MAP[cat.slug] || Code2,
      isPopular: idx < 2,
    }));
  }, [rawCategories]);

  return (
    <section
      aria-labelledby="categories-heading"
      className="relative overflow-hidden bg-background py-16 sm:py-20 lg:py-28"
    >
      {/* Background Radial Ambient Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-105 w-full max-w-7xl -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent blur-3xl"
      />

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <CategoriesHeader />

        {isLoading ? (
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:mt-12 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-44 rounded-2xl border border-border/60 bg-card/50 p-6 space-y-3"
              >
                <Skeleton className="size-10 rounded-lg" />
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>
        ) : categories.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-dashed border-border/80 bg-card/40 p-8 text-center">
            <p className="text-sm text-muted-foreground">
              Categories are being curated. Check back shortly!
            </p>
          </div>
        ) : (
          <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:mt-12 lg:grid-cols-4">
            {categories.map((category) => (
              <li key={category.id} className="h-full">
                <CategoryCard category={category} />
              </li>
            ))}
          </ul>
        )}
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
            specialization.
          </span>
        </h2>

        <p className="mt-3.5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          Dive into structured learning paths tailored for modern software architects and full stack
          engineers.
        </p>
      </div>

      <Link
        href="/courses"
        className="group inline-flex items-center gap-2 self-start rounded-lg border border-border/80 bg-card/60 px-4 py-2.5 text-sm font-semibold text-foreground shadow-xs backdrop-blur-md transition-all duration-300 hover:border-primary/30 hover:bg-card hover:text-primary hover:shadow-md sm:self-auto"
      >
        <span>All specializations</span>
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
  readonly category: CourseCategory;
}

function CategoryCard({ category }: CategoryCardProps) {
  const Icon = category.icon;

  return (
    <Card className="group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border-border/60 bg-card/60 p-6 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:bg-card hover:shadow-xl hover:shadow-primary/5">
      <div>
        <div className="flex items-center justify-between">
          <div className="flex size-12 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary transition-colors duration-300 group-hover:border-primary/40 group-hover:bg-primary group-hover:text-primary-foreground">
            <Icon aria-hidden="true" className="size-6" />
          </div>

          {category.isPopular && (
            <Badge
              variant="outline"
              className="inline-flex items-center gap-1 rounded-full border-primary/30 bg-primary/10 text-[10px] font-bold uppercase tracking-wider text-primary"
            >
              <Sparkles className="size-2.5" />
              <span>Popular</span>
            </Badge>
          )}
        </div>

        <h3 className="mt-5 text-lg font-bold tracking-tight text-foreground transition-colors duration-200 group-hover:text-primary">
          {category.name}
        </h3>

        <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
          {category.description}
        </p>
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-border/40 pt-4">
        <span className="text-xs font-semibold text-muted-foreground">
          {category.courseCount > 0 ? `${category.courseCount} Courses` : 'Courses available'}
        </span>

        <Link
          href={`/courses?category=${category.slug}`}
          className="inline-flex items-center gap-1 text-xs font-bold text-primary transition-transform duration-200 group-hover:translate-x-1"
        >
          <span>Explore</span>
          <ArrowRight aria-hidden="true" className="size-3.5" />
        </Link>
      </div>
    </Card>
  );
}
