'use client';

import React from 'react';
import Link from 'next/link';
import { Star, Clock, BookOpen, Users, Play, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface CourseHeroProps {
  readonly course: {
    readonly id: string;
    readonly title: string;
    readonly slug: string;
    readonly subtitle?: string | null;
    readonly isBestseller: boolean;
    readonly isFeatured: boolean;
    readonly category?: { readonly name: string } | null;
    readonly rating: number;
    readonly reviewCount: number;
    readonly enrollmentCount: number;
    readonly totalDurationMinutes: number;
    readonly totalLessonsCount: number;
    readonly price: number;
    readonly originalPrice?: number | null;
    readonly thumbnailUrl?: string | null;
    readonly trailerVideoUrl?: string | null;
    readonly instructor: {
      readonly headline?: string | null;
      readonly user: {
        readonly firstName: string;
        readonly lastName?: string | null;
        readonly avatarUrl?: string | null;
      };
    };
  };
  readonly onOpenPreview: () => void;
}

function formatDuration(minutes: number): string {
  if (!minutes || minutes <= 0) return '15m On-demand';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h > 0 && m > 0) return `${h}h ${m}m On-demand`;
  if (h > 0) return `${h}h On-demand`;
  return `${m}m On-demand`;
}

export function CourseHero({ course, onOpenPreview }: CourseHeroProps) {
  const formattedDuration = formatDuration(course.totalDurationMinutes);

  return (
    <header className="relative overflow-hidden border-b border-border/70 py-10 sm:py-25 space-y-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Title, Metadata, Byline, CTAs */}
          <div className="lg:col-span-7 space-y-5 sm:space-y-6">
            {/* Badges Row */}
            <div className="flex flex-wrap items-center gap-2">
              {course.category && (
                <Badge
                  variant="secondary"
                  className="px-3 py-1 text-xs font-semibold rounded-full bg-primary/10 text-primary border border-primary/20 shadow-2xs"
                >
                  {course.category.name}
                </Badge>
              )}

              {course.isBestseller && (
                <Badge
                  variant="outline"
                  className="px-3 py-1 text-xs font-semibold rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/25 gap-1 shadow-2xs"
                >
                  🔥 Bestseller
                </Badge>
              )}

              <Badge
                variant="outline"
                className="px-3 py-1 text-xs font-medium rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25 gap-1.5 shadow-2xs"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Verified Curriculum
              </Badge>
            </div>

            {/* Course Title */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[2.75rem] font-black tracking-tight text-foreground leading-[1.14] text-balance">
              {course.title}
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl font-normal text-pretty">
              {course.subtitle ||
                'Build a real-world production-grade application while learning modern distributed engineering practices.'}
            </p>

            {/* Quick Metrics Bar */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-1 text-xs sm:text-sm">
              <div className="flex items-center gap-1.5 font-bold text-amber-500 dark:text-amber-400">
                <Star className="h-4 w-4 fill-amber-500 dark:fill-amber-400 text-amber-500 dark:text-amber-400" />
                <span>{course.rating.toFixed(1)}</span>
                <span className="font-normal text-muted-foreground">
                  {course.reviewCount > 0
                    ? `(${course.reviewCount.toLocaleString()} reviews)`
                    : '· New Course'}
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-foreground/90 font-medium">
                <Users className="h-4 w-4 text-primary" />
                <span>{(course.enrollmentCount || 1200).toLocaleString()}+ Learners</span>
              </div>

              <div className="flex items-center gap-1.5 text-foreground/90 font-medium">
                <Clock className="h-4 w-4 text-primary" />
                <span>{formattedDuration}</span>
              </div>

              <div className="flex items-center gap-1.5 text-foreground/90 font-medium">
                <BookOpen className="h-4 w-4 text-primary" />
                <span>{course.totalLessonsCount || 1} Lessons</span>
              </div>
            </div>

            {/* Instructor Micro-card */}
            <div className="flex items-center gap-3 pt-1">
              <div className="h-11 w-11 rounded-full bg-primary/10 border border-primary/25 flex items-center justify-center font-bold text-primary overflow-hidden shrink-0 shadow-2xs">
                {course.instructor.user.avatarUrl ? (
                  <img
                    src={course.instructor.user.avatarUrl}
                    alt={course.instructor.user.firstName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span>{course.instructor.user.firstName[0]}</span>
                )}
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Lead Instructor
                </p>
                <p className="text-sm font-bold text-foreground truncate">
                  {course.instructor.user.firstName} {course.instructor.user.lastName || ''}
                  {course.instructor.headline && (
                    <span className="font-normal text-xs text-muted-foreground ml-2">
                      · {course.instructor.headline}
                    </span>
                  )}
                </p>
              </div>
            </div>

            {/* Action CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <Button
                asChild
                variant="default"
                size="lg"
                className="h-12 px-8 text-sm font-bold rounded-xl shadow-md shadow-primary/20 hover:shadow-primary/30 transition-all gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Link href={`/checkout/${course.slug}`}>
                  <span>Enroll Now · ₹{course.price.toLocaleString()}</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>

              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={onOpenPreview}
                className="gap-2.5 h-12 px-6 text-sm font-semibold rounded-xl border-border/80 bg-card/80 hover:bg-muted text-foreground backdrop-blur-xs transition-all shadow-2xs"
              >
                <Play className="h-4 w-4 text-primary fill-primary" />
                <span>Try for Free</span>
              </Button>
            </div>
          </div>

          {/* Right Column: Hero Video Preview Trailer Card */}
          <div className="lg:col-span-5">
            <div className="relative group">
              {/* Backlight Ambient Glow using CSS primary token */}
              <div className="absolute -inset-2 rounded-3xl bg-primary/15 blur-2xl opacity-60 group-hover:opacity-90 transition duration-500 -z-10" />

              <div
                onClick={onOpenPreview}
                className="relative cursor-pointer overflow-hidden rounded-2xl border border-border/80 bg-card shadow-xl transition-all duration-300 group-hover:border-primary/50 group-hover:shadow-2xl group-hover:scale-[1.01]"
              >
                <div className="aspect-video w-full overflow-hidden relative flex items-center justify-center bg-muted">
                  {course.thumbnailUrl ? (
                    <img
                      src={course.thumbnailUrl}
                      alt={course.title}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-radial from-primary/15 via-muted to-background" />
                  )}

                  {/* Dark Vignette Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                  {/* Pulsing Play Button */}
                  <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-xl shadow-primary/40 backdrop-blur-xs transition-all duration-300 group-hover:scale-110 group-hover:bg-primary/95">
                    <Play className="h-6 w-6 fill-current ml-0.5" />
                  </div>

                  {/* Bottom Information Glass Strip */}
                  <div className="absolute bottom-3 inset-x-3 flex items-center justify-between rounded-xl bg-background/85 dark:bg-card/85 backdrop-blur-md px-3.5 py-2 text-xs border border-border/50 text-foreground shadow-sm z-10">
                    <div className="flex items-center gap-1.5 font-semibold">
                      <Sparkles className="h-3.5 w-3.5 text-amber-500 dark:text-amber-400" />
                      <span>Watch Free Preview</span>
                    </div>

                    <span className="font-mono text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Trailer Available
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
