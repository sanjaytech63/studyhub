import React from 'react';
import { Metadata } from 'next';
import { parseCourseFilters } from '@/utils/course-filters';
import { CourseCatalog } from './components/course-catalog';

export const metadata: Metadata = {
  title: 'Explore Courses | StudyHub Marketplace',
  description: 'Browse practical tech, design, and business courses from industry experts.',
};

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function CoursesPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const filters = parseCourseFilters(resolvedSearchParams);

  return <CourseCatalog filters={filters} />;
}
