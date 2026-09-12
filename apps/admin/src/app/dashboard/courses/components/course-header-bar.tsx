'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, ChevronRight, ExternalLink, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface CourseHeaderBarProps {
  courseTitle: string;
  courseSlug?: string;
  courseId: string;
  status: string;
  isFormDirty: boolean;
  isSaving: boolean;
  isPublishing: boolean;
  onSave: () => void;
  onPublish: () => void;
}

export function CourseHeaderBar({
  courseTitle,
  courseSlug,
  courseId,
  status,
  isFormDirty,
  isSaving,
  isPublishing,
  onSave,
  onPublish,
}: CourseHeaderBarProps) {
  const isPublished = status === 'PUBLISHED';

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-6">
      <div className="flex items-center gap-4 min-w-0">
        <Link
          href="/dashboard/courses"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border/80 bg-card text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors shadow-xs"
          title="Back to courses list"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>

        <div className="min-w-0 space-y-1">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Link href="/dashboard/courses" className="hover:text-foreground transition-colors">
              Courses
            </Link>
            <ChevronRight className="h-3 w-3 text-muted-foreground/60" />
            <span className="truncate max-w-50 font-medium text-foreground">{courseTitle}</span>
          </div>

          <div className="flex items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground truncate max-w-lg">
              {courseTitle}
            </h1>
            <Badge
              variant={isPublished ? 'active' : status === 'DRAFT' ? 'suspended' : 'inactive'}
              className="font-mono text-[10px]"
            >
              {status}
            </Badge>
            {isFormDirty && (
              <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-medium text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                Unsaved changes
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Global Action Bar */}
      <div className="flex items-center gap-2.5 shrink-0">
        {isPublished ? (
          <a
            href={`${process.env.NEXT_PUBLIC_WEB_URL || 'http://localhost:3000'}/courses/${courseSlug || courseId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center"
          >
            <Button
              type="button"
              variant="outline"
              size="sm"
              leftIcon={<ExternalLink className="h-3.5 w-3.5" />}
            >
              Preview Live
            </Button>
          </a>
        ) : (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onPublish}
            isLoading={isPublishing}
            leftIcon={<CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />}
          >
            Publish Course
          </Button>
        )}

        <Button
          type="button"
          variant="primary"
          size="sm"
          onClick={onSave}
          isLoading={isSaving}
          leftIcon={<Save className="h-3.5 w-3.5" />}
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
}
