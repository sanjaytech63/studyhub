import Link from 'next/link';
import { BookOpen } from 'lucide-react';
import { EmptyState } from '@/components/feedback/empty-state';
import type { LearningCourse } from '@/lib/dashboard/dashboard.types';
import { LearningCourseCard } from './learning-course-card';

interface ContinueLearningProps {
  readonly courses: readonly LearningCourse[];
}

export function ContinueLearning({ courses }: ContinueLearningProps) {
  return (
    <section aria-labelledby="continue-learning-title" className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 id="continue-learning-title" className="text-base font-semibold">
            Continue Learning
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">Pick up where you left off.</p>
        </div>

        <Link
          href="/learning"
          className="shrink-0 text-sm font-medium text-primary transition-colors hover:underline"
        >
          View all
        </Link>
      </div>

      {courses.length === 0 ? (
        <EmptyState
          title="No courses in progress"
          message="Start learning a course and your progress will appear here."
          actionLabel="Explore courses"
          actionHref="/learning"
          icon={<BookOpen className="size-5" />}
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {courses.map((course) => (
            <LearningCourseCard key={course.id} {...course} />
          ))}
        </div>
      )}
    </section>
  );
}
