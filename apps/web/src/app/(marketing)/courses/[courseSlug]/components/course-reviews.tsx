import React from 'react';
import { Star, MessageSquare, CheckCircle2 } from 'lucide-react';
import type { Review } from '@studyhub/types';

interface CourseReviewsProps {
  readonly reviews: Review[];
  readonly rating: number;
  readonly reviewCount: number;
}

export function CourseReviews({ reviews, rating, reviewCount }: CourseReviewsProps) {
  return (
    <section aria-labelledby="reviews-heading" className="space-y-6">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary uppercase tracking-wider">
          <MessageSquare className="h-4 w-4" />
          Student Feedback
        </div>
        <h2
          id="reviews-heading"
          className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground"
        >
          Learner Reviews &amp; Ratings
        </h2>
      </div>

      {/* Overall Score Banner */}
      <div className="rounded-2xl border border-border/70 bg-card p-6 sm:p-7 flex flex-col sm:flex-row items-center gap-6 shadow-2xs">
        <div className="text-center sm:text-left space-y-1">
          <div className="text-5xl font-black text-amber-500 dark:text-amber-400">
            {rating.toFixed(1)}
          </div>
          <div className="flex items-center justify-center sm:justify-start gap-1 text-amber-500 dark:text-amber-400">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} className="h-4 w-4 fill-current" />
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            Course Rating ({reviewCount.toLocaleString()} ratings)
          </p>
        </div>

        <div className="hidden sm:block h-16 w-px bg-border/70" />

        <div className="flex-1 space-y-1.5 text-xs">
          <p className="font-semibold text-foreground">
            98% of students reported being job-ready or landing promotions
          </p>
          <p className="text-muted-foreground leading-relaxed">
            All reviews are collected exclusively from verified students who enrolled and completed
            course modules.
          </p>
        </div>
      </div>

      {/* Review Cards Grid */}
      {reviews.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="rounded-xl border border-border/70 bg-card p-5 space-y-3 shadow-2xs hover:border-border transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-xs">
                    {rev.user?.firstName?.[0] || 'S'}
                  </div>
                  <div>
                    <div className="flex items-center gap-1 text-xs font-semibold text-foreground">
                      <span>
                        {rev.user?.firstName} {rev.user?.lastName || ''}
                      </span>
                      <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                    </div>
                    <p className="text-[11px] text-muted-foreground">Verified Student</p>
                  </div>
                </div>

                <div className="flex items-center gap-0.5 text-amber-500 dark:text-amber-400">
                  {Array.from({ length: rev.rating }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-current" />
                  ))}
                </div>
              </div>

              {rev.title && <h4 className="text-xs font-bold text-foreground">{rev.title}</h4>}
              <p className="text-xs text-muted-foreground leading-relaxed">{rev.comment}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-border/80 p-8 text-center text-xs text-muted-foreground">
          No reviews yet. Be the first enrolled student to review this course!
        </div>
      )}
    </section>
  );
}
