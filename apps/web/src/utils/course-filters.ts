import {
  CourseFilters,
  CourseSort,
  CourseLevel,
  CoursePriceType,
  CourseDuration,
} from '@/lib/courses/course-types';

export const DEFAULT_PAGE_SIZE = 12;

export function parseCourseFilters(
  searchParams: Record<string, string | string[] | undefined>,
): CourseFilters {
  const getSingle = (param: string | string[] | undefined): string | undefined =>
    Array.isArray(param) ? param[0] : param;

  const rawRating = parseFloat(getSingle(searchParams.rating) || '');
  const rawPage = parseInt(getSingle(searchParams.page) || '1', 10);

  return {
    search: getSingle(searchParams.search) || undefined,
    category: getSingle(searchParams.category) || undefined,
    level: (getSingle(searchParams.level) as CourseLevel) || undefined,
    price: (getSingle(searchParams.price) as CoursePriceType) || undefined,
    rating: !isNaN(rawRating) ? rawRating : undefined,
    duration: (getSingle(searchParams.duration) as CourseDuration) || undefined,
    sort: (getSingle(searchParams.sort) as CourseSort) || 'recommended',
    page: !isNaN(rawPage) && rawPage > 0 ? rawPage : 1,
  };
}

export function buildFilterQueryString(
  currentFilters: CourseFilters,
  updates: Partial<CourseFilters>,
): string {
  const merged = { ...currentFilters, ...updates };
  const params = new URLSearchParams();

  if (merged.search) params.set('search', merged.search);
  if (merged.category && merged.category !== 'all') params.set('category', merged.category);
  if (merged.level && merged.level !== 'all-levels') params.set('level', merged.level);
  if (merged.price && merged.price !== 'all') params.set('price', merged.price);
  if (merged.rating && merged.rating > 0) params.set('rating', merged.rating.toString());
  if (merged.duration) params.set('duration', merged.duration);
  if (merged.sort && merged.sort !== 'recommended') params.set('sort', merged.sort);
  if (merged.page && merged.page > 1) params.set('page', merged.page.toString());

  const queryString = params.toString();
  return queryString ? `?${queryString}` : '/courses';
}
