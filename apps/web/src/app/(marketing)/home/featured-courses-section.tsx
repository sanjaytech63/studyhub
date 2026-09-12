'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { ArrowRight, Check, Sparkles } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

import { CourseCard } from './course-card';
import { type FeaturedCourse } from './data/featured-courses';
import { useCourses } from '@/lib/courses/course.queries';

/* ==========================================================================
   TYPES
========================================================================== */

interface DiscoveryFilter {
  readonly label: string;
  readonly value: string;
}

const DISCOVERY_FILTERS: readonly DiscoveryFilter[] = [
  { label: 'All courses', value: 'all' },
  { label: 'Full Stack & Web', value: 'Full Stack & Web' },
  { label: 'System Design', value: 'System Design & Microservices' },
  { label: 'Cloud & DevOps', value: 'Cloud, DevOps & Kubernetes' },
];

/* ==========================================================================
   FEATURED COURSES SECTION
========================================================================== */

export function FeaturedCoursesSection() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { data, isLoading } = useCourses({ limit: 12 });

  const mappedCourses: FeaturedCourse[] = useMemo(() => {
    if (!data?.courses || data.courses.length === 0) return [];

    return data.courses.map((c) => ({
      id: c.id,
      slug: c.slug,
      title: c.title,
      description: c.subtitle || c.description || '',
      thumbnail:
        c.thumbnailUrl ||
        'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=800&q=80',
      category: {
        name: c.category?.name || 'Software Engineering',
        slug: c.category?.slug || 'development',
      },
      instructor: {
        id: c.instructor?.id || 'inst-1',
        name: c.instructor?.user
          ? `${c.instructor.user.firstName} ${c.instructor.user.lastName ?? ''}`.trim()
          : 'StudyHub Architect',
        avatar:
          c.instructor?.user?.avatarUrl ||
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      },
      level: (c.level ? c.level.charAt(0) + c.level.slice(1).toLowerCase() : 'Intermediate') as
        'Beginner' | 'Intermediate' | 'Advanced',
      rating: c.rating ?? 4.9,
      reviewCount: c.reviewCount ?? 120,
      duration: `${Math.round((c.totalDurationMinutes || 180) / 60)}h`,
      price: c.price,
      originalPrice: c.originalPrice ?? undefined,
      currency: 'INR' as const,
      discountPercentage:
        c.originalPrice && c.originalPrice > c.price
          ? Math.round(((c.originalPrice - c.price) / c.originalPrice) * 100)
          : undefined,
    }));
  }, [data]);

  const filteredCourses = useMemo(() => {
    if (selectedCategory === 'all') return mappedCourses;
    return mappedCourses.filter((c) => c.category.name === selectedCategory);
  }, [mappedCourses, selectedCategory]);

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

        {/* Discovery Filter Tabs */}
        <nav aria-label="Course categories filter" className="mt-8 lg:mt-10">
          <div className="no-scrollbar overflow-x-auto pb-2 pt-1">
            <div className="flex min-w-max items-center gap-2.5">
              {DISCOVERY_FILTERS.map((filter) => {
                const active = selectedCategory === filter.value;
                return (
                  <button
                    key={filter.value}
                    type="button"
                    onClick={() => setSelectedCategory(filter.value)}
                    aria-current={active ? 'page' : undefined}
                    className={`inline-flex h-10 shrink-0 items-center gap-2 rounded-full px-4 text-xs font-semibold transition-all duration-300 ${
                      active
                        ? 'bg-primary text-primary-foreground shadow-md shadow-primary/25 ring-2 ring-primary/20'
                        : 'border border-border/60 bg-card/60 text-muted-foreground hover:border-border hover:bg-card hover:text-foreground'
                    }`}
                  >
                    {active && <Check aria-hidden="true" className="size-3.5" />}
                    <span>{filter.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
          <div className="mt-4 h-px w-full bg-linear-to-r from-transparent via-border/80 to-transparent" />
        </nav>

        {/* Dynamic Grid */}
        {isLoading ? (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="flex flex-col space-y-3 rounded-2xl border border-border/60 bg-card/50 p-4"
              >
                <Skeleton className="aspect-16/10 w-full rounded-lg" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <div className="pt-4 flex justify-between">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-20" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredCourses.length === 0 ? (
          <FeaturedCoursesEmptyState />
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {filteredCourses.map((course, index) => (
              <CourseCard key={course.id} course={course} priority={index < 2} />
            ))}
          </div>
        )}
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
        className="group inline-flex items-center gap-2 self-start rounded-lg border border-border/80 bg-card/60 px-4 py-2.5 text-sm font-semibold text-foreground shadow-xs backdrop-blur-md transition-all duration-300 hover:border-primary/30 hover:bg-card hover:text-primary hover:shadow-md lg:self-auto"
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
          className="mt-6 rounded-lg border-border/80 bg-card hover:border-primary/30 hover:bg-card hover:text-primary"
          asChild
        >
          <Link href="/courses" className="inline-flex items-center gap-2">
            <span>Browse Courses</span>
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
