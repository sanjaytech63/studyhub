'use client';

import React, { useMemo } from 'react';
import { Course, CourseFilters, CourseLevel } from '@/lib/courses/course-types';
import { DEFAULT_PAGE_SIZE } from '@/utils/course-filters';
import { CatalogHeader } from './catalog-header';
import { CourseToolbar } from './course-toolbar';
import { FilterSidebar } from './filter-sidebar';
import { ActiveFilterChips } from './active-filter-chips';
import { CourseGrid } from './course-grid';
import { CoursePagination } from './course-pagination';
import { useCourses } from '@/lib/courses/course.queries';
import { Skeleton } from '@/components/ui/skeleton';

interface CourseCatalogProps {
  readonly filters: CourseFilters;
}

export function CourseCatalog({ filters }: CourseCatalogProps) {
  const { data, isLoading } = useCourses({
    search: filters.search,
    category: filters.category,
    level: filters.level ? filters.level.toUpperCase() : undefined,
    page: filters.page || 1,
    limit: DEFAULT_PAGE_SIZE,
  });

  const courses: readonly Course[] = useMemo(() => {
    if (!data?.courses || data.courses.length === 0) return [];

    return data.courses.map((c) => ({
      id: c.id,
      slug: c.slug,
      title: c.title,
      description: c.subtitle || c.description || '',
      category: c.category?.name || 'Development',
      level: (c.level?.toLowerCase() || 'intermediate') as CourseLevel,
      rating: c.rating ?? 4.9,
      reviewCount: c.reviewCount ?? 150,
      durationHours: Math.round((c.totalDurationMinutes || 180) / 60),
      lessonCount: c.totalLessonsCount || 45,
      price: c.price,
      originalPrice: c.originalPrice ?? undefined,
      isBestseller: c.isBestseller,
      isFeatured: c.isFeatured,
      imageUrl:
        c.thumbnailUrl ||
        'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=800&q=80',
      updatedAt: new Date().toISOString(),
      instructor: {
        id: c.instructor?.id || 'inst-1',
        name: c.instructor?.user
          ? `${c.instructor.user.firstName} ${c.instructor.user.lastName ?? ''}`.trim()
          : 'StudyHub Architect',
        title: c.instructor?.headline || 'Senior Architect',
        avatarUrl:
          c.instructor?.user?.avatarUrl ||
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      },
    }));
  }, [data]);

  const totalCount = data?.pagination?.totalCount ?? courses.length;
  const currentPage = filters.page || 1;
  const totalPages = Math.ceil(totalCount / DEFAULT_PAGE_SIZE) || 1;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 md:py-16 lg:py-24 xl:py-28 space-y-8 max-w-7xl">
      {/* Editorial Catalog Header */}
      <CatalogHeader totalCourses={totalCount} />

      {/* Discovery Toolbar */}
      <div className="space-y-3">
        <CourseToolbar filters={filters} totalResults={totalCount} />
        <ActiveFilterChips filters={filters} />
      </div>

      {/* Main Body Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Persistent Desktop Sidebar */}
        <div className="hidden lg:block lg:col-span-1 sticky top-20">
          <div className="rounded-lg border border-border/60 bg-card p-5 shadow-xs">
            <FilterSidebar filters={filters} />
          </div>
        </div>

        {/* Results Area */}
        <main className="lg:col-span-3 space-y-6">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="flex flex-col space-y-3 rounded-lg border border-border/60 bg-card p-4"
                >
                  <Skeleton className="aspect-video w-full rounded-lg" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <div className="pt-3 flex justify-between">
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-5 w-20" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <CourseGrid courses={courses} />
              {totalPages > 1 && (
                <CoursePagination currentPage={currentPage} totalPages={totalPages} />
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
