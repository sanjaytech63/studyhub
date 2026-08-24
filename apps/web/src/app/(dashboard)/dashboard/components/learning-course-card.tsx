import Link from 'next/link';
import { ArrowRight, BookOpen } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

import type { LearningCourse } from '@/lib/dashboard/dashboard.types';

interface LearningCourseCardProps {
  readonly course: LearningCourse;
}

export function LearningCourseCard({ course }: LearningCourseCardProps) {
  return (
    <div
      className={[
        'group rounded-xl border border-border/60',
        'bg-background p-4',
        'transition-all duration-200',
        'hover:border-primary/20 hover:bg-muted/20',
      ].join(' ')}
    >
      <div className="flex gap-4">
        {/* Course thumbnail */}
        <div className="hidden size-16 shrink-0 overflow-hidden rounded-xl bg-muted sm:block">
          {course.imageUrl ? (
            <img
              src={course.imageUrl}
              alt=""
              className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex size-full items-center justify-center text-muted-foreground">
              <BookOpen className="size-6" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <Badge variant="secondary" className="mb-2 rounded-full px-2 py-0.5 text-[10px]">
                {course.category}
              </Badge>

              <h3 className="truncate text-sm font-semibold">{course.title}</h3>
            </div>

            <Button variant="ghost" size="icon" className="size-8 shrink-0">
              <Link href={`/learning/${course.id}`} aria-label={`Continue ${course.title}`}>
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>

          <div className="mt-4">
            <div className="mb-2 flex items-center justify-between gap-3">
              <span className="text-xs text-muted-foreground">Course progress</span>

              <span className="text-xs font-semibold tabular-nums">{course.progress}%</span>
            </div>

            <Progress value={course.progress} className="h-1.5" />
          </div>

          {course.lastAccessedAt && (
            <p className="mt-2 text-[11px] text-muted-foreground">
              Last accessed {course.lastAccessedAt}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
