'use client';

import React from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { CourseFilters } from '@/lib/courses/course-types';
import { FilterSidebar } from './filter-sidebar';

interface MobileFilterSheetProps {
  readonly filters: CourseFilters;
  readonly totalResults: number;
}

export function MobileFilterSheet({ filters, totalResults }: MobileFilterSheetProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger>
        <Button
          variant="outline"
          size="sm"
          className="h-10 border-border/80 lg:hidden font-medium text-xs"
        >
          <SlidersHorizontal className="mr-2 size-3.5 text-muted-foreground" />
          Filters
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-full max-w-xs sm:max-w-sm overflow-y-auto p-6">
        <SheetHeader className="pb-4 border-b border-border/60">
          <SheetTitle className="text-base font-bold text-left">Filter Courses</SheetTitle>
        </SheetHeader>
        <div className="py-4">
          <FilterSidebar filters={filters} />
        </div>
        <div className="pt-4 border-t border-border/60">
          <Button className="w-full font-semibold" size="sm" onClick={() => setOpen(false)}>
            Show {totalResults} Results
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
