import Link from 'next/link';
import { ArrowRight, BookOpen } from 'lucide-react';

import type { LearningCourse } from '@/lib/dashboard/dashboard.types';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { LearningCourseCard } from './learning-course-card';

interface ContinueLearningProps {
  readonly courses: readonly LearningCourse[];
}

export function ContinueLearning({ courses }: ContinueLearningProps) {
  return (
    <Card className="overflow-hidden border-border/60 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between gap-4 border-b border-border/60 px-5 py-5 sm:px-6">
        <div className="flex items-start gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <BookOpen className="size-4.5" />
          </div>

          <div>
            <h2 className="text-base font-semibold tracking-tight">Continue learning</h2>

            <p className="mt-1 text-sm text-muted-foreground">Pick up where you left off.</p>
          </div>
        </div>

        <Button variant="ghost" size="sm" className="hidden shrink-0 sm:inline-flex">
          <Link href="/learning">
            View all
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </CardHeader>

      <CardContent className="p-4 sm:p-5">
        {courses.length === 0 ? (
          <EmptyLearningState />
        ) : (
          <div className="grid gap-3">
            {courses.slice(0, 4).map((course) => (
              <LearningCourseCard key={course.id} course={course} />
            ))}
          </div>
        )}

        <Button variant="ghost" size="sm" className="mt-3 w-full sm:hidden">
          <Link href="/learning">
            View all courses
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

function EmptyLearningState() {
  return (
    <div className="flex min-h-48 flex-col items-center justify-center rounded-xl border border-dashed border-border/70 bg-muted/20 px-6 text-center">
      <div className="flex size-10 items-center justify-center rounded-xl bg-muted text-muted-foreground">
        <BookOpen className="size-5" />
      </div>

      <p className="mt-3 text-sm font-medium">No courses in progress</p>

      <p className="mt-1 max-w-sm text-xs leading-5 text-muted-foreground">
        Start a course and your active learning progress will appear here.
      </p>

      <Button size="sm" className="mt-4">
        <Link href="/learning">Explore courses</Link>
      </Button>
    </div>
  );
}
