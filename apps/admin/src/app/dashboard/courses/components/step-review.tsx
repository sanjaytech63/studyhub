'use client';

import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/input';

interface StepReviewProps {
  title?: string;
  slug?: string;
  isFree?: boolean;
  price?: number;
  level?: string;
  modulesCount: number;
  totalLessons: number;
  totalFreePreviews: number;
  categoryName?: string;
  saving: boolean;
  onBack: () => void;
  onPublish: () => void;
}

export function StepReview({
  title,
  slug,
  isFree,
  price,
  level,
  modulesCount,
  totalLessons,
  totalFreePreviews,
  categoryName,
  saving,
  onBack,
  onPublish,
}: StepReviewProps) {
  return (
    <Card className="max-w-3xl space-y-6 p-6">
      <div>
        <h2 className="text-base font-bold text-foreground">
          Course Summary &amp; Readiness Check
        </h2>

        <p className="mt-1 text-xs text-muted-foreground">
          Review the course configuration before creating or publishing it.
        </p>
      </div>

      {/* Course Summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Title */}
        <Card className="border-border/60 bg-muted/20 p-4 shadow-none">
          <Label className="text-[10px] font-mono uppercase text-muted-foreground">Title</Label>

          <p className="mt-1 truncate text-sm font-bold text-foreground">
            {title || 'Untitled Course'}
          </p>

          <p className="truncate text-[11px] font-mono text-muted-foreground">
            {slug || 'auto-generated-slug'}
          </p>
        </Card>

        {/* Pricing */}
        <Card className="border-border/60 bg-muted/20 p-4 shadow-none">
          <Label className="text-[10px] font-mono uppercase text-muted-foreground">
            Pricing &amp; Level
          </Label>

          <p className="mt-1 text-sm font-bold text-foreground">
            {isFree ? 'Free' : `₹${Number(price || 0).toLocaleString('en-IN')}`}
          </p>

          <p className="text-[11px] font-medium text-muted-foreground">Level: {level}</p>
        </Card>
      </div>

      {/* Curriculum Summary */}
      <Card className="border-border/60 bg-muted/20 p-4 shadow-none">
        <Label className="text-[10px] font-mono uppercase text-muted-foreground">
          Curriculum Composition
        </Label>

        <div className="mt-3 grid grid-cols-1 gap-4 text-xs sm:grid-cols-3">
          <div>
            <p className="text-muted-foreground">Modules</p>
            <p className="mt-1 text-lg font-bold text-foreground">{modulesCount}</p>
          </div>

          <div>
            <p className="text-muted-foreground">Lessons</p>
            <p className="mt-1 text-lg font-bold text-foreground">{totalLessons}</p>
          </div>

          <div>
            <p className="text-muted-foreground">Free Previews</p>
            <p className="mt-1 text-lg font-bold text-emerald-500">{totalFreePreviews}</p>
          </div>
        </div>
      </Card>

      {/* Category */}
      <Card className="border-border/60 bg-muted/20 p-4 shadow-none">
        <Label className="text-[10px] font-mono uppercase text-muted-foreground">Category</Label>

        <p className="mt-1 text-sm font-medium text-foreground">
          {categoryName || 'No category selected'}
        </p>
      </Card>

      {/* Navigation */}
      <div className="flex flex-col-reverse justify-between gap-3 pt-4 sm:flex-row">
        <Button type="button" variant="outline" onClick={onBack}>
          ← Back to Curriculum
        </Button>

        <Button
          type="button"
          variant="primary"
          disabled={saving}
          onClick={onPublish}
          leftIcon={<CheckCircle2 className="h-4 w-4" />}
        >
          {saving ? 'Publishing...' : 'Launch & Publish Now'}
        </Button>
      </div>
    </Card>
  );
}
