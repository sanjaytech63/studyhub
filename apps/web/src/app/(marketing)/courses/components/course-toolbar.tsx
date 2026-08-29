'use client';

import React, { useTransition } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Search, ArrowUpDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CourseFilters, CourseSort } from '@/lib/courses/course-types';

interface CourseToolbarProps {
  readonly filters: CourseFilters;
  readonly totalResults: number;
}

// export function CourseToolbar({ filters, totalResults }: CourseToolbarProps) {
export function CourseToolbar({ filters }: CourseToolbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  // const [isPending, startTransition] = useTransition();
  const [, startTransition] = useTransition();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set('search', value);
    } else {
      params.delete('search');
    }
    params.set('page', '1');
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    });
  };

  const handleSortChange = (value: CourseSort | null) => {
    const selectedSort = value ?? 'recommended';
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', selectedSort);
    params.set('page', '1');
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    });
  };

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border/60 bg-card p-3 sm:p-4 shadow-xs">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <Input
            type="search"
            placeholder="Search courses, skills, or topics..."
            defaultValue={filters.search || ''}
            onChange={handleSearchChange}
            className="pl-9 bg-background h-10 border-border/80 focus-visible:ring-1 focus-visible:ring-ring text-sm"
            aria-label="Search courses"
          />
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Mobile Filter Drawer Trigger */}
          {/* <MobileFilterSheet filters={filters} totalResults={totalResults} /> */}

          {/* Sort Selector */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="hidden text-xs font-medium text-muted-foreground lg:inline-block">
              Sort by:
            </span>
            <Select value={filters.sort ?? 'recommended'} onValueChange={handleSortChange}>
              <SelectTrigger className="h-10 w-40 sm:w-45 bg-background text-xs font-medium border-border/80">
                <ArrowUpDown className="mr-2 size-3.5 text-muted-foreground" />
                <SelectValue placeholder="Sort courses" />
              </SelectTrigger>
              <SelectContent align="end">
                <SelectItem value="recommended">Recommended</SelectItem>
                <SelectItem value="popular">Most Popular</SelectItem>
                <SelectItem value="highest-rated">Highest Rated</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}
