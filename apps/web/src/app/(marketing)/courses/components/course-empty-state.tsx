'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { SearchX } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function CourseEmptyState() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/80 bg-card/50 p-8 sm:p-12 text-center my-6">
      <div className="flex size-12 items-center justify-center rounded-xl bg-muted/80 text-muted-foreground mb-4">
        <SearchX className="size-6" />
      </div>
      <h3 className="text-base font-bold text-foreground tracking-tight">
        No courses match your criteria
      </h3>
      <p className="mt-1.5 max-w-sm text-xs sm:text-sm text-muted-foreground leading-relaxed">
        Try adjusting your search terms, changing categories, or clearing active filters to find
        what you are looking for.
      </p>
      <Button
        variant="outline"
        size="sm"
        onClick={() => router.push(pathname)}
        className="mt-6 font-medium text-xs border-border/80"
      >
        Reset All Filters
      </Button>
    </div>
  );
}
