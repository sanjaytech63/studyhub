'use client';

import React from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CourseFilters } from '@/lib/courses/course-types';

interface ActiveFilterChipsProps {
  readonly filters: CourseFilters;
}

export function ActiveFilterChips({ filters }: ActiveFilterChipsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const removeFilter = (key: keyof CourseFilters) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(key);
    params.set('page', '1');
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const clearAllFilters = () => {
    router.push(pathname, { scroll: false });
  };

  const activeChips: { key: keyof CourseFilters; label: string }[] = [];

  if (filters.category && filters.category !== 'all') {
    activeChips.push({ key: 'category', label: `Category: ${filters.category}` });
  }
  if (filters.level && filters.level !== 'all-levels') {
    activeChips.push({ key: 'level', label: `Level: ${filters.level}` });
  }
  if (filters.price && filters.price !== 'all') {
    activeChips.push({ key: 'price', label: `Price: ${filters.price}` });
  }
  if (filters.rating) {
    activeChips.push({ key: 'rating', label: `Rating: ${filters.rating}+ Stars` });
  }
  if (filters.duration) {
    activeChips.push({ key: 'duration', label: `Duration: ${filters.duration}` });
  }

  if (activeChips.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 pt-2">
      <span className="text-xs font-medium text-muted-foreground mr-1">Active Filters:</span>
      {activeChips.map((chip) => (
        <Badge
          key={chip.key}
          variant="secondary"
          className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium border border-border/60 bg-muted/50 rounded-md"
        >
          <span className="capitalize">{chip.label}</span>
          <button
            type="button"
            onClick={() => removeFilter(chip.key)}
            className="ml-1 rounded-xs hover:text-foreground text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            aria-label={`Remove filter ${chip.label}`}
          >
            <X className="size-3" />
          </button>
        </Badge>
      ))}

      <Button
        variant="ghost"
        size="sm"
        onClick={clearAllFilters}
        className="h-7 text-xs font-medium text-muted-foreground hover:text-foreground px-2"
      >
        Clear all
      </Button>
    </div>
  );
}
