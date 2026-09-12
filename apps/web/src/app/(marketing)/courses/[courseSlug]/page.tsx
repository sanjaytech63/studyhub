'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useCourseBySlug } from '@/lib/courses/course.queries';
import { CourseHero } from './components/course-hero';
import { WhatYoullBuild } from './components/what-youll-build';
import { TechStackGrid } from './components/tech-stack-grid';
import { CurriculumAccordion } from './components/curriculum-accordion';
import { FreePreviewModal } from './components/free-preview-modal';
import { StickyEnrollCard } from './components/sticky-enroll-card';
import { CourseReviews } from './components/course-reviews';
import {
  Check,
  UserCheck,
  HelpCircle,
  AlertCircle,
  ArrowLeft,
  GraduationCap,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import type { Lesson } from '@studyhub/types';

export default function CourseDetailsPage() {
  const params = useParams();
  const slug = (params?.courseSlug as string) || '';

  const { data: course, isLoading, isError, refetch } = useCourseBySlug(slug);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedPreviewLesson, setSelectedPreviewLesson] = useState<Lesson | null>(null);

  const handleOpenPreview = (lesson?: Lesson) => {
    const firstPreviewableLesson =
      course?.modules?.flatMap((m) => m.lessons || []).find((l) => l.isFreePreview || l.videoUrl) ||
      null;
    setSelectedPreviewLesson(lesson || firstPreviewableLesson);
    setIsPreviewOpen(true);
  };

  if (isLoading) {
    return <CourseDetailsSkeleton />;
  }

  if (isError || !course) {
    return (
      <div className="min-h-[85vh] flex flex-col items-center justify-center px-4 text-center">
        <div className="size-16 rounded-2xl bg-destructive/10 text-destructive flex items-center justify-center mb-4 shadow-2xs">
          <AlertCircle className="size-8" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Course Not Found
        </h1>
        <p className="mt-2 text-sm text-muted-foreground max-w-md">
          The course you requested could not be located or may currently be offline. Please verify
          the URL or explore our active catalog.
        </p>
        <div className="mt-6 flex gap-3">
          <Button variant="outline" onClick={() => void refetch()} className="rounded-xl">
            Retry
          </Button>
          <Button asChild className="rounded-xl shadow-xs">
            <Link href="/courses" className="inline-flex items-center gap-2">
              <ArrowLeft className="size-4" />
              <span>Explore Catalog</span>
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const learningOutcomes = Array.isArray(course.learningOutcomes) ? course.learningOutcomes : [];
  const prerequisites = Array.isArray(course.prerequisites) ? course.prerequisites : [];
  const targetAudience = Array.isArray(course.targetAudience) ? course.targetAudience : [];
  const technologies =
    (
      course as unknown as {
        technologies?: Array<{
          technology: { name: string; category: string; iconUrl?: string | null };
        }>;
      }
    ).technologies || [];

  const normalizedCourse = {
    ...course,
    trailerVideoUrl: course.trailerVideoUrl || null,
    rating: course.rating ?? 4.9,
    reviewCount: course.reviewCount ?? 0,
    enrollmentCount: course.enrollmentCount ?? 0,
    isBestseller: Boolean(course.isBestseller),
    isFeatured: Boolean(course.isFeatured),
    totalDurationMinutes: course.totalDurationMinutes ?? 0,
    totalLessonsCount: course.totalLessonsCount ?? 0,
    instructor: {
      headline: course.instructor?.headline || 'Senior Instructor',
      user: {
        firstName: course.instructor?.user?.firstName || 'StudyHub',
        lastName: course.instructor?.user?.lastName || 'Instructor',
        avatarUrl: course.instructor?.user?.avatarUrl || null,
      },
    },
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-20 lg:pb-0">
      {/* 07 — Course Hero */}
      <CourseHero course={normalizedCourse} onOpenPreview={() => handleOpenPreview()} />

      {/* Main Content & Sticky Sidebar Grid */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-10 sm:py-14 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Main Information Architecture Column */}
          <div className="lg:col-span-8 space-y-12 sm:space-y-14">
            {/* 08 — What You'll Build */}
            {course.outcomeDescription && (
              <WhatYoullBuild outcomeDescription={course.outcomeDescription} />
            )}

            {/* 09 — Tech Stack */}
            {technologies.length > 0 && <TechStackGrid technologies={technologies} />}

            {/* What You'll Learn */}
            {learningOutcomes.length > 0 && (
              <section aria-labelledby="outcomes-heading" className="space-y-6">
                <div className="space-y-1.5">
                  <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary uppercase tracking-wider">
                    <Sparkles className="h-4 w-4" />
                    Key Competencies
                  </div>
                  <h2
                    id="outcomes-heading"
                    className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground"
                  >
                    What You&apos;ll Learn
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {learningOutcomes.map((outcome: string) => (
                    <div
                      key={outcome}
                      className="flex items-start gap-3 rounded-xl border border-border/70 bg-card p-4 text-xs sm:text-sm text-foreground shadow-2xs hover:border-primary/40 hover:shadow-xs transition-all"
                    >
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mt-0.5">
                        <Check className="h-3.5 w-3.5" />
                      </span>
                      <span className="leading-snug">{outcome}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 10 — Curriculum Accordion */}
            <CurriculumAccordion
              modules={course.modules || []}
              onSelectPreviewLesson={(lesson) => handleOpenPreview(lesson)}
            />

            {/* Prerequisites & Audience */}
            {(prerequisites.length > 0 || targetAudience.length > 0) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {prerequisites.length > 0 && (
                  <section
                    aria-labelledby="prereq-heading"
                    className="rounded-2xl border border-border/70 bg-card p-6 sm:p-7 space-y-4 shadow-2xs"
                  >
                    <h3
                      id="prereq-heading"
                      className="text-base font-bold text-foreground flex items-center gap-2"
                    >
                      <HelpCircle className="h-4 w-4 text-primary" />
                      Prerequisites
                    </h3>
                    <ul className="space-y-2.5 text-xs sm:text-sm text-muted-foreground">
                      {prerequisites.map((p: string) => (
                        <li key={p} className="flex items-start gap-2.5">
                          <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 shrink-0" />
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>
                  </section>
                )}

                {targetAudience.length > 0 && (
                  <section
                    aria-labelledby="audience-heading"
                    className="rounded-2xl border border-border/70 bg-card p-6 sm:p-7 space-y-4 shadow-2xs"
                  >
                    <h3
                      id="audience-heading"
                      className="text-base font-bold text-foreground flex items-center gap-2"
                    >
                      <UserCheck className="h-4 w-4 text-primary" />
                      Who This Course Is For
                    </h3>
                    <ul className="space-y-2.5 text-xs sm:text-sm text-muted-foreground">
                      {targetAudience.map((a: string) => (
                        <li key={a} className="flex items-start gap-2.5">
                          <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 shrink-0" />
                          <span>{a}</span>
                        </li>
                      ))}
                    </ul>
                  </section>
                )}
              </div>
            )}

            {/* Instructor Showcase */}
            {course.instructor?.user && (
              <section
                aria-labelledby="instructor-heading"
                className="rounded-2xl border border-border/70 bg-card p-6 sm:p-8 space-y-5 shadow-2xs"
              >
                <div className="flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-wider">
                  <GraduationCap className="h-4 w-4" />
                  Course Author
                </div>
                <h2
                  id="instructor-heading"
                  className="text-xl sm:text-2xl font-bold text-foreground"
                >
                  Meet Your Instructor
                </h2>
                <div className="flex flex-col sm:flex-row items-start gap-5 pt-1">
                  <div className="h-16 w-16 rounded-2xl bg-primary/10 overflow-hidden shrink-0 border border-primary/25 shadow-2xs">
                    {course.instructor.user.avatarUrl ? (
                      <img
                        src={course.instructor.user.avatarUrl}
                        alt={course.instructor.user.firstName}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center font-bold text-xl text-primary">
                        {course.instructor.user.firstName?.[0] || 'I'}
                      </div>
                    )}
                  </div>
                  <div className="space-y-2 text-xs sm:text-sm flex-1">
                    <h3 className="text-base sm:text-lg font-bold text-foreground">
                      {course.instructor.user.firstName} {course.instructor.user.lastName || ''}
                    </h3>
                    <p className="text-xs text-primary font-semibold">
                      {course.instructor.headline || 'Lead Technical Instructor'}
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      Senior software practitioner with deep production experience building and
                      deploying distributed microservices, scalable architectures, and robust cloud
                      platforms.
                    </p>
                  </div>
                </div>
              </section>
            )}

            {/* 22 — Reviews */}
            <CourseReviews
              reviews={course.reviews || []}
              rating={normalizedCourse.rating}
              reviewCount={normalizedCourse.reviewCount}
            />
          </div>

          {/* Right Sticky Sidebar Column */}
          <div className="hidden lg:block lg:col-span-4 sticky top-24">
            <StickyEnrollCard course={normalizedCourse} onOpenPreview={() => handleOpenPreview()} />
          </div>
        </div>
      </main>

      {/* Mobile Sticky Floating Bottom CTA Bar */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 bg-background/95 backdrop-blur-md border-t border-border/80 px-4 py-3 z-40 shadow-2xl flex items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-medium text-muted-foreground block">Tuition</span>
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-black text-foreground">
              ₹{course.price.toLocaleString()}
            </span>
            {course.originalPrice && course.originalPrice > course.price && (
              <span className="text-xs text-muted-foreground line-through">
                ₹{course.originalPrice.toLocaleString()}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleOpenPreview()}
            className="h-10 text-xs font-semibold rounded-xl border-border/80 bg-background"
          >
            Preview
          </Button>
          <Button
            asChild
            size="sm"
            className="h-10 px-5 text-xs font-bold rounded-xl shadow-md shadow-primary/20 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Link href={`/checkout/${course.slug}`}>Enroll Now</Link>
          </Button>
        </div>
      </div>

      {/* 12 — Free Preview Modal */}
      <FreePreviewModal
        isOpen={isPreviewOpen}
        lesson={selectedPreviewLesson}
        courseSlug={course.slug}
        courseTitle={course.title}
        coursePrice={course.price}
        trailerVideoUrl={normalizedCourse.trailerVideoUrl}
        modules={course.modules || []}
        onSelectLesson={(lesson) => setSelectedPreviewLesson(lesson)}
        onClose={() => setIsPreviewOpen(false)}
      />
    </div>
  );
}

function CourseDetailsSkeleton() {
  return (
    <div className="min-h-screen bg-background py-10 sm:py-25 px-4 max-w-7xl mx-auto space-y-10">
      <div className="space-y-4 max-w-3xl">
        <Skeleton className="h-6 w-32 rounded-full" />
        <Skeleton className="h-12 w-4/5 rounded-xl" />
        <Skeleton className="h-6 w-3/5 rounded-lg" />
        <div className="flex gap-4 pt-2">
          <Skeleton className="h-5 w-24 rounded-md" />
          <Skeleton className="h-5 w-28 rounded-md" />
          <Skeleton className="h-5 w-28 rounded-md" />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        <div className="lg:col-span-8 space-y-8">
          <Skeleton className="h-64 w-full rounded-2xl" />
          <Skeleton className="h-44 w-full rounded-2xl" />
          <Skeleton className="h-96 w-full rounded-2xl" />
        </div>
        <div className="hidden lg:block lg:col-span-4">
          <Skeleton className="h-110 w-full rounded-3xl" />
        </div>
      </div>
    </div>
  );
}
