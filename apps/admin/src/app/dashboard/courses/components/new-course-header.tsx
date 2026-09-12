'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NewCourseHeaderProps {
  saving: boolean;
  onSaveDraft: () => void;
  onPublishCourse: () => void;
  errorMsg: string | null;
}

export function NewCourseHeader({
  saving,
  onSaveDraft,
  onPublishCourse,
  errorMsg,
}: NewCourseHeaderProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col justify-between gap-4 border-b border-border/60 pb-6 sm:flex-row sm:items-center">
        <div className="flex min-w-0 items-center gap-4">
          <Button type="button" variant="outline" size="icon" className="shrink-0">
            <Link href="/dashboard/courses" aria-label="Back to courses">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>

          <div className="min-w-0">
            <h1 className="flex items-center gap-2 text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              <Sparkles className="h-5 w-5 shrink-0 text-primary" />
              <span className="truncate">Course Studio &amp; Curriculum Builder</span>
            </h1>

            <p className="mt-1 text-xs text-muted-foreground">
              Design your syllabus, configure free preview gates, and manage video/article lessons.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <Button type="button" variant="outline" disabled={saving} onClick={onSaveDraft}>
            {saving ? 'Saving...' : 'Save Draft'}
          </Button>

          <Button
            type="button"
            variant="primary"
            disabled={saving}
            onClick={onPublishCourse}
            leftIcon={<CheckCircle2 className="h-4 w-4" />}
          >
            {saving ? 'Publishing...' : 'Publish Course'}
          </Button>
        </div>
      </div>

      {errorMsg && (
        <div
          role="alert"
          className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-xs font-medium text-destructive"
        >
          {errorMsg}
        </div>
      )}
    </div>
  );
}
