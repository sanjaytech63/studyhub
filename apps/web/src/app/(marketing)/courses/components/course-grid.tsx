import React from 'react';
import { Course } from '@/lib/courses/course-types';
import { CourseCard } from './course-card';
import { CourseEmptyState } from './course-empty-state';

interface CourseGridProps {
  readonly courses: readonly Course[];
}

export function CourseGrid({ courses }: CourseGridProps) {
  if (courses.length === 0) {
    return <CourseEmptyState />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 lg:gap-6">
      {courses.map((course, index) => (
        <CourseCard key={course.id} course={course} priorityImage={index < 4} />
      ))}
    </div>
  );
}
