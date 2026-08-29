import React from 'react';
import { CourseFilters } from '@/lib/courses/course-types';
import { getFilteredCourses } from '../data/courses';
import { DEFAULT_PAGE_SIZE } from '@/utils/course-filters';
import { CatalogHeader } from './catalog-header';
import { CourseToolbar } from './course-toolbar';
import { FilterSidebar } from './filter-sidebar';
import { ActiveFilterChips } from './active-filter-chips';
import { CourseGrid } from './course-grid';
import { CoursePagination } from './course-pagination';

interface CourseCatalogProps {
  readonly filters: CourseFilters;
}

export function CourseCatalog({ filters }: CourseCatalogProps) {
  const { courses, totalCount } = getFilteredCourses(filters);

  // Pagination slicing
  const currentPage = filters.page || 1;
  const totalPages = Math.ceil(totalCount / DEFAULT_PAGE_SIZE);
  const startIndex = (currentPage - 1) * DEFAULT_PAGE_SIZE;
  const paginatedCourses = courses.slice(startIndex, startIndex + DEFAULT_PAGE_SIZE);

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
          <div className="rounded-xl border border-border/60 bg-card p-5 shadow-xs">
            <FilterSidebar filters={filters} />
          </div>
        </div>

        {/* Results Area */}
        <main className="lg:col-span-3 space-y-6">
          <CourseGrid courses={paginatedCourses} />
          <CoursePagination currentPage={currentPage} totalPages={totalPages} />
        </main>
      </div>
    </div>
  );
}
