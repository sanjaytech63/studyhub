'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { X, Play, Lock, Sparkles, FileText, Layers } from 'lucide-react';
import type { Lesson, CourseModule } from '@studyhub/types';
import { VideoPlayer } from '@/components/ui/video-player';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export interface FreePreviewModalProps {
  readonly isOpen: boolean;
  readonly lesson?: Lesson | null;
  readonly courseSlug: string;
  readonly courseTitle?: string;
  readonly coursePrice: number;
  readonly trailerVideoUrl?: string | null;
  readonly modules?: CourseModule[];
  readonly onSelectLesson?: (lesson: Lesson) => void;
  readonly onClose: () => void;
}

export function FreePreviewModal({
  isOpen,
  lesson,
  courseSlug,
  courseTitle,
  coursePrice,
  trailerVideoUrl,
  modules = [],
  onSelectLesson,
  onClose,
}: FreePreviewModalProps) {
  const [activeTab, setActiveTab] = useState<'video' | 'notes'>('video');

  if (!isOpen) return null;

  // Find all free preview lessons in the curriculum
  const freeLessons = modules.flatMap((m) =>
    (m.lessons || []).filter((l) => l.isFreePreview || l.videoUrl),
  );

  // Active video source: prioritizes lesson video, falls back to course trailer
  const activeVideoUrl = lesson?.videoUrl || trailerVideoUrl || null;
  const hasContentMarkdown = Boolean(lesson?.contentMarkdown?.trim());

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="preview-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
    >
      {/* Click outside backdrop to close */}
      <div className="absolute inset-0 -z-10" onClick={onClose} />

      <div className="relative w-full max-w-5xl overflow-hidden rounded-3xl border border-border/80 bg-card shadow-2xl flex flex-col max-h-[92vh] transition-all text-card-foreground">
        {/* Modal Top Header */}
        <div className="flex items-center justify-between border-b border-border/70 px-5 sm:px-7 py-4 bg-muted/40 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-3 min-w-0 pr-4">
            <Badge
              variant="outline"
              className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25 font-bold px-2.5 py-0.5 text-xs rounded-full shrink-0 gap-1.5 shadow-2xs"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              FREE PREVIEW
            </Badge>

            <div className="min-w-0">
              <h2
                id="preview-modal-title"
                className="text-sm sm:text-base font-extrabold text-foreground truncate"
              >
                {lesson?.title ||
                  (trailerVideoUrl
                    ? `${courseTitle || 'Course'} - Trailer`
                    : 'Interactive Lesson Preview')}
              </h2>
              {courseTitle && (
                <p className="text-[11px] text-muted-foreground truncate">
                  {courseTitle} {lesson?.durationMinutes ? `· ${lesson.durationMinutes} mins` : ''}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {hasContentMarkdown && activeVideoUrl && (
              <div className="hidden sm:flex items-center rounded-xl bg-muted p-1 border border-border/60 text-xs">
                <button
                  type="button"
                  onClick={() => setActiveTab('video')}
                  className={cn(
                    'px-2.5 py-1 rounded-lg font-medium transition-colors',
                    activeTab === 'video'
                      ? 'bg-primary text-primary-foreground font-semibold shadow-2xs'
                      : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  Video
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('notes')}
                  className={cn(
                    'px-2.5 py-1 rounded-lg font-medium transition-colors',
                    activeTab === 'notes'
                      ? 'bg-primary text-primary-foreground font-semibold shadow-2xs'
                      : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  Notes
                </button>
              </div>
            )}

            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              aria-label="Close modal"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Modal Body: Player or Reading Material */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {activeTab === 'video' && activeVideoUrl ? (
            <div className="w-full">
              <VideoPlayer
                src={activeVideoUrl}
                title={lesson?.title || `${courseTitle || 'Course'} Trailer`}
                autoPlay={false}
                className="w-full shadow-xl rounded-2xl border border-border/40"
              />
            </div>
          ) : activeTab === 'notes' || hasContentMarkdown ? (
            <div className="rounded-2xl border border-border/70 bg-muted/20 p-6 sm:p-8 text-foreground space-y-4 leading-relaxed font-normal text-sm">
              <div className="flex items-center gap-2 text-primary text-xs font-bold uppercase tracking-wider">
                <FileText className="h-4 w-4" />
                Lesson Lecture Notes &amp; Code Snippets
              </div>
              <div className="prose dark:prose-invert max-w-none text-xs sm:text-sm whitespace-pre-wrap font-sans">
                {lesson?.contentMarkdown ||
                  'In this preview lesson, we walk through the end-to-end multi-tenant system design, architectural topology, and distributed microservices infrastructure.'}
              </div>
            </div>
          ) : (
            /* Graceful Fallback if neither video nor notes exist */
            <div className="aspect-video w-full overflow-hidden rounded-2xl bg-muted/40 border border-border/70 flex flex-col items-center justify-center text-center p-6 space-y-3">
              <div className="h-14 w-14 rounded-full bg-primary/10 text-primary flex items-center justify-center shadow-2xs">
                <Play className="h-6 w-6 fill-current ml-0.5" />
              </div>
              <div className="space-y-1 max-w-md">
                <h4 className="text-sm sm:text-base font-bold text-foreground">
                  Full Video Available Upon Enrollment
                </h4>
                <p className="text-xs text-muted-foreground">
                  This lesson includes high-definition on-demand streaming, downloadable source code
                  repositories, and interactive exercises.
                </p>
              </div>
              <Button asChild variant="default" size="sm" className="mt-2 rounded-xl">
                <Link href={`/checkout/${courseSlug}`}>
                  <Lock className="h-3.5 w-3.5 mr-1.5" />
                  Unlock Full Course
                </Link>
              </Button>
            </div>
          )}

          {/* Curriculum Lesson Switcher Bar (If multiple previewable lessons exist) */}
          {freeLessons.length > 1 && (
            <div className="space-y-2 pt-2">
              <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5 text-primary" />
                More Free Preview Lessons in this Course:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {freeLessons.map((l) => {
                  const isCurrent = lesson?.id === l.id;
                  return (
                    <button
                      key={l.id}
                      type="button"
                      onClick={() => onSelectLesson?.(l)}
                      className={cn(
                        'flex items-center justify-between p-2.5 rounded-xl border text-left text-xs transition-all',
                        isCurrent
                          ? 'border-primary/50 bg-primary/10 text-primary font-semibold shadow-2xs'
                          : 'border-border/70 bg-card text-muted-foreground hover:bg-muted hover:text-foreground',
                      )}
                    >
                      <div className="flex items-center gap-2 min-w-0 pr-2">
                        <Play className="h-3 w-3 text-primary fill-primary shrink-0" />
                        <span className="truncate">{l.title}</span>
                      </div>
                      <span className="text-[10px] font-mono text-muted-foreground shrink-0">
                        {l.durationMinutes}m
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Footer Banner: Unlock Full Course */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border/70 bg-muted/40 px-5 sm:px-7 py-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-amber-500/10 border border-amber-500/25 flex items-center justify-center shrink-0">
              <Sparkles className="h-4 w-4 text-amber-500 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-foreground">
                Like what you see? Unlock the full curriculum
              </p>
              <p className="text-[11px] text-muted-foreground">
                Includes all project code repositories, HD videos, certificate &amp; Discord
                community.
              </p>
            </div>
          </div>

          <Button
            asChild
            variant="default"
            size="lg"
            className="w-full sm:w-auto h-11 px-7 text-xs sm:text-sm font-bold rounded-xl shadow-md shadow-primary/20 hover:shadow-primary/30 shrink-0 gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Link href={`/checkout/${courseSlug}`} onClick={onClose}>
              <Lock className="h-3.5 w-3.5" />
              <span>Enroll Now · ₹{coursePrice.toLocaleString()}</span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
