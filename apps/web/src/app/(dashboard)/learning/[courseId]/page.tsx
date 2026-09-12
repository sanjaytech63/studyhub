'use client';

import React, { useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  CheckCircle2,
  Circle,
  FileText,
  ChevronLeft,
  ChevronRight,
  Award,
  Download,
  MessageSquare,
  FileCode,
  Check,
  AlertCircle,
  BookOpen,
} from 'lucide-react';
import { useCourseBySlug } from '@/lib/courses/course.queries';
import { useLessonContent, useUpdateLessonProgress } from '@/lib/learning/learning.queries';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { VideoPlayer } from '@/components/ui/video-player';
import type { CourseModule, Lesson } from '@studyhub/types';

export default function CoursePlayerPage() {
  const params = useParams();
  const courseSlug = (params?.courseId as string) || '';

  const { data: course, isLoading, isError } = useCourseBySlug(courseSlug);
  const updateProgressMutation = useUpdateLessonProgress();

  // Flattened lessons for navigation
  const allLessons = useMemo(() => {
    if (!course?.modules) return [];
    return course.modules.flatMap((m: CourseModule) => m.lessons || []);
  }, [course]);

  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const [completedIds, setCompletedIds] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState<'notes' | 'resources' | 'discussion'>('resources');
  const [certificateCode, setCertificateCode] = useState<string | null>(null);

  // Derive active lesson ID and lesson object directly without synchronous effect
  const activeLessonId = selectedLessonId || allLessons[0]?.id || '';

  const { data: lessonDetail } = useLessonContent(activeLessonId);

  const activeLesson = useMemo(() => {
    return allLessons.find((l: Lesson) => l.id === activeLessonId) || allLessons[0] || null;
  }, [allLessons, activeLessonId]);

  const activeIndex = useMemo(() => {
    if (!activeLesson) return 0;
    return allLessons.findIndex((l: Lesson) => l.id === activeLesson.id);
  }, [allLessons, activeLesson]);

  const hasPrevious = activeIndex > 0;
  const hasNext = activeIndex < allLessons.length - 1;

  const totalLessons = allLessons.length;
  const completedCount = Object.values(completedIds).filter(Boolean).length;
  const progressPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  const handleMarkComplete = async () => {
    if (!activeLesson) return;
    const nextCompleted = !completedIds[activeLesson.id];

    try {
      const res = await updateProgressMutation.mutateAsync({
        lessonId: activeLesson.id,
        watchTimeSeconds: (activeLesson.durationMinutes || 10) * 60,
        isCompleted: nextCompleted,
      });

      setCompletedIds((prev) => ({
        ...prev,
        [activeLesson.id]: nextCompleted,
      }));

      if (res?.certificate) {
        setCertificateCode(res.certificate.certificateCode);
      }
    } catch {
      setCompletedIds((prev) => ({
        ...prev,
        [activeLesson.id]: nextCompleted,
      }));
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <div className="h-14 border-b border-border/80 px-6 flex items-center justify-between">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12">
          <div className="hidden lg:block lg:col-span-3 border-r border-border/80 p-4 space-y-3">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="lg:col-span-9 p-8 space-y-6">
            <Skeleton className="aspect-video w-full rounded-2xl" />
            <Skeleton className="h-8 w-2/3" />
            <Skeleton className="h-32 w-full rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !course) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center space-y-4">
        <div className="size-16 rounded-2xl bg-destructive/10 text-destructive flex items-center justify-center">
          <AlertCircle className="size-8" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">Course Player Unavailable</h1>
        <p className="text-sm text-muted-foreground max-w-md">
          We could not load curriculum materials for this course. Please return to your learning
          dashboard.
        </p>
        <Button asChild>
          <Link href="/learning">Back to My Learning</Link>
        </Button>
      </div>
    );
  }

  if (allLessons.length === 0 || !activeLesson) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center space-y-4">
        <div className="size-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
          <BookOpen className="size-8" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">Lessons Coming Soon</h1>
        <p className="text-sm text-muted-foreground max-w-md">
          Curriculum modules are being finalized for this course.
        </p>
        <Button asChild>
          <Link href="/learning">Back to My Learning</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* Top Learning Navigation Bar */}
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border/80 bg-card/95 px-4 sm:px-6 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <Link
            href="/learning"
            className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Dashboard</span>
          </Link>
          <div className="h-4 w-px bg-border/80" />
          <h1 className="text-xs sm:text-sm font-bold text-foreground truncate max-w-xs sm:max-w-md">
            {course.title}
          </h1>
        </div>

        {/* Course Progress Indicator */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-[11px] font-mono text-muted-foreground">
              {completedCount} of {totalLessons} completed ({progressPercent}%)
            </span>
            <div className="h-1.5 w-32 overflow-hidden rounded-full bg-muted mt-1">
              <div
                className="h-full bg-primary rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {progressPercent === 100 && (
            <Link
              href={certificateCode ? `/certificates/${certificateCode}` : '/learning'}
              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500/15 px-3 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/30"
            >
              <Award className="h-3.5 w-3.5" />
              Claim Certificate
            </Link>
          )}
        </div>
      </header>

      {/* Dual Pane Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        {/* Left: Collapsible Curriculum Sidebar */}
        <aside className="lg:col-span-4 xl:col-span-3 border-r border-border/80 bg-card overflow-y-auto max-h-[calc(100vh-3.5rem)]">
          <div className="p-4 border-b border-border/60">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Course Curriculum
            </h3>
          </div>

          <div className="divide-y divide-border/40">
            {course.modules?.map((module: CourseModule) => (
              <div key={module.id} className="p-2 space-y-1">
                <div className="px-3 py-1.5 text-xs font-bold text-foreground">{module.title}</div>
                <div className="space-y-0.5">
                  {module.lessons?.map((lesson: Lesson) => {
                    const isActive = lesson.id === activeLessonId;
                    const isDone = Boolean(completedIds[lesson.id]);

                    return (
                      <button
                        key={lesson.id}
                        type="button"
                        onClick={() => setSelectedLessonId(lesson.id)}
                        className={`w-full flex items-center justify-between rounded-lg px-3 py-2 text-left text-xs transition-colors ${
                          isActive
                            ? 'bg-primary/10 text-primary font-semibold border border-primary/20'
                            : 'text-foreground/80 hover:bg-muted/50'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0 pr-2">
                          {isDone ? (
                            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                          ) : (
                            <Circle className="h-4 w-4 shrink-0 text-muted-foreground/60" />
                          )}
                          <span className="truncate">{lesson.title}</span>
                        </div>

                        <span className="shrink-0 text-[11px] font-mono text-muted-foreground">
                          {lesson.durationMinutes}m
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Right: Lesson Viewport & Player */}
        <main className="lg:col-span-8 xl:col-span-9 flex flex-col justify-between overflow-y-auto max-h-[calc(100vh-3.5rem)] bg-background">
          <div className="p-6 sm:p-8 space-y-6 max-w-5xl mx-auto w-full">
            {/* Viewport Frame */}
            {activeLesson.type === 'VIDEO' ? (
              <VideoPlayer
                src={lessonDetail?.videoUrl || activeLesson.videoUrl || ''}
                title={activeLesson.title}
                onEnded={() => {
                  if (!completedIds[activeLesson.id]) {
                    handleMarkComplete();
                  }
                }}
              />
            ) : (
              <div className="aspect-video w-full overflow-hidden rounded-2xl border border-border/80 bg-slate-950 shadow-2xl relative flex items-center justify-center">
                <div className="p-8 text-center space-y-3">
                  <FileText className="h-12 w-12 text-primary mx-auto" />
                  <h3 className="text-lg font-bold text-white">Reading Material</h3>
                  <p className="text-xs text-slate-400">See reading notes below.</p>
                </div>
              </div>
            )}

            {/* Lesson Title & Controls Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground">
                  {activeLesson.title}
                </h2>
                <p className="text-xs text-muted-foreground mt-1">
                  Lesson {activeIndex + 1} of {totalLessons} · {activeLesson.durationMinutes}{' '}
                  minutes
                </p>
              </div>

              {/* Mark Complete & Navigation */}
              <div className="flex items-center gap-2.5">
                {hasPrevious && (
                  <button
                    type="button"
                    onClick={() => setSelectedLessonId(allLessons[activeIndex - 1]!.id)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-4 py-2.5 text-xs sm:text-sm font-semibold text-foreground hover:bg-muted transition-colors"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span>Previous</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleMarkComplete}
                  disabled={updateProgressMutation.isPending}
                  className={`inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-xs sm:text-sm font-semibold transition-all ${
                    completedIds[activeLesson.id]
                      ? 'bg-emerald-500/15 text-emerald-500 border border-emerald-500/30'
                      : 'bg-card border border-border text-foreground hover:bg-muted'
                  }`}
                >
                  <Check className="h-4 w-4" />
                  {completedIds[activeLesson.id] ? 'Completed ✓' : 'Mark Complete'}
                </button>

                {hasNext && (
                  <button
                    type="button"
                    onClick={() => setSelectedLessonId(allLessons[activeIndex + 1]!.id)}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-5 py-2.5 text-xs sm:text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
                  >
                    <span>Next</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Bottom Tabs: Notes | Resources | Discussion */}
            <div className="space-y-4">
              <div className="flex items-center gap-6 border-b border-border/60">
                <button
                  type="button"
                  onClick={() => setActiveTab('resources')}
                  className={`pb-3 text-xs font-semibold uppercase tracking-wider transition-colors border-b-2 ${
                    activeTab === 'resources'
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Resources &amp; Code
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('notes')}
                  className={`pb-3 text-xs font-semibold uppercase tracking-wider transition-colors border-b-2 ${
                    activeTab === 'notes'
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Lesson Notes
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('discussion')}
                  className={`pb-3 text-xs font-semibold uppercase tracking-wider transition-colors border-b-2 ${
                    activeTab === 'discussion'
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Discussion
                </button>
              </div>

              {/* Tab Contents */}
              {activeTab === 'resources' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="flex items-center justify-between rounded-lg border border-border/80 bg-card p-4">
                    <div className="flex items-center gap-3">
                      <FileCode className="h-5 w-5 text-primary" />
                      <div>
                        <h4 className="text-xs font-bold text-foreground">
                          GitHub Source Repository
                        </h4>
                        <p className="text-[11px] text-muted-foreground">
                          Branch: lesson-{activeIndex + 1}-start
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="rounded-lg bg-muted p-2 text-muted-foreground hover:text-foreground"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between rounded-lg border border-border/80 bg-card p-4">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-amber-500" />
                      <div>
                        <h4 className="text-xs font-bold text-foreground">
                          Architecture Diagram PDF
                        </h4>
                        <p className="text-[11px] text-muted-foreground">
                          Topology &amp; database schemas
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="rounded-lg bg-muted p-2 text-muted-foreground hover:text-foreground"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'notes' && (
                <div className="rounded-lg border border-border/80 bg-card p-6 text-xs sm:text-sm text-foreground space-y-3 leading-relaxed">
                  <p>
                    {lessonDetail?.contentMarkdown ||
                      activeLesson.contentMarkdown ||
                      'No notes available for this lesson.'}
                  </p>
                </div>
              )}

              {activeTab === 'discussion' && (
                <div className="rounded-lg border border-border/80 bg-card p-6 text-center space-y-2">
                  <MessageSquare className="h-8 w-8 text-muted-foreground mx-auto" />
                  <h4 className="text-xs font-bold text-foreground">Community Discussion</h4>
                  <p className="text-xs text-muted-foreground">
                    Have questions about this lesson? Connect with peers and instructors in our
                    community channels.
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
