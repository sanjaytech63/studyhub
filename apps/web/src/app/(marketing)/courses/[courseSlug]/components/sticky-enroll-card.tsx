'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Video, Code2, Award, Users, RefreshCw, ArrowRight, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface StickyEnrollCardProps {
  readonly course: {
    readonly id: string;
    readonly slug: string;
    readonly price: number;
    readonly originalPrice?: number | null;
    readonly totalDurationMinutes: number;
    readonly totalLessonsCount: number;
  };
  readonly onOpenPreview: () => void;
}

export function StickyEnrollCard({ course, onOpenPreview }: StickyEnrollCardProps) {
  const discountPercent =
    course.originalPrice && course.originalPrice > course.price
      ? Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100)
      : null;

  const durationLabel =
    course.totalDurationMinutes >= 60
      ? `${(course.totalDurationMinutes / 60).toFixed(1)} hours`
      : `${course.totalDurationMinutes || 15} mins`;

  return (
    <aside
      aria-label="Course Enrollment"
      className="rounded-3xl border border-border/80 bg-card p-6 sm:p-7 shadow-xl space-y-6 relative overflow-hidden backdrop-blur-xs"
    >
      {/* Top subtle brand highlight */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      {/* Price Header */}
      <div className="space-y-1.5">
        <div className="flex items-baseline gap-3 flex-wrap">
          <span className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
            ₹{course.price.toLocaleString()}
          </span>
          {course.originalPrice && (
            <span className="text-base text-muted-foreground line-through">
              ₹{course.originalPrice.toLocaleString()}
            </span>
          )}
          {discountPercent && (
            <Badge
              variant="outline"
              className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25 text-xs font-bold px-2 py-0.5"
            >
              {discountPercent}% OFF
            </Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground flex items-center gap-1.5 pt-0.5">
          <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
          <span>30-day full money-back guarantee</span>
        </p>
      </div>

      {/* Primary Actions */}
      <div className="space-y-2.5">
        <Button
          asChild
          variant="default"
          size="lg"
          className="w-full h-12 text-sm font-bold rounded-xl shadow-md shadow-primary/20 hover:shadow-primary/30 transition-all gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Link href={`/checkout/${course.slug}`}>
            <span>Enroll in Course Now</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>

        <Button
          type="button"
          variant="outline"
          size="default"
          onClick={onOpenPreview}
          className="w-full h-11 rounded-xl border border-border/80 bg-background/80 hover:bg-muted text-foreground text-xs font-semibold transition-colors gap-2 shadow-2xs"
        >
          <Play className="h-3.5 w-3.5 text-primary fill-primary" />
          <span>Try Free Preview</span>
        </Button>
      </div>

      {/* What's Included Section */}
      <div className="border-t border-border/60 pt-5 space-y-3.5">
        <h4 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
          This Course Includes:
        </h4>
        <ul className="space-y-3 text-xs text-foreground/85">
          <li className="flex items-center gap-2.5">
            <Video className="h-4 w-4 text-primary shrink-0" />
            <span>{durationLabel} HD on-demand video</span>
          </li>
          <li className="flex items-center gap-2.5">
            <Code2 className="h-4 w-4 text-primary shrink-0" />
            <span>Full production source code &amp; architectures</span>
          </li>
          <li className="flex items-center gap-2.5">
            <Award className="h-4 w-4 text-primary shrink-0" />
            <span>Verified Certificate of Completion</span>
          </li>
          <li className="flex items-center gap-2.5">
            <Users className="h-4 w-4 text-primary shrink-0" />
            <span>Private Discord community &amp; code reviews</span>
          </li>
          <li className="flex items-center gap-2.5">
            <RefreshCw className="h-4 w-4 text-primary shrink-0" />
            <span>Lifetime access with future syllabus updates</span>
          </li>
        </ul>
      </div>
    </aside>
  );
}
