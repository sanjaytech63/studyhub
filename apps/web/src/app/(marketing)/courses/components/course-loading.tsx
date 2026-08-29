import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 max-w-7xl animate-pulse">
      {/* Header Skeleton */}
      <div className="space-y-3 border-b border-border/40 pb-6">
        <Skeleton className="h-4 w-24 rounded-md" />
        <Skeleton className="h-9 w-3/4 max-w-md rounded-md" />
        <Skeleton className="h-4 w-1/2 max-w-sm rounded-md" />
      </div>

      {/* Toolbar Skeleton */}
      <Skeleton className="h-14 w-full rounded-xl" />

      {/* Body Skeleton Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="hidden lg:block lg:col-span-1">
          <Skeleton className="h-125 w-full rounded-xl" />
        </div>
        <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex flex-col space-y-3 rounded-xl border border-border/40 p-4">
              <Skeleton className="aspect-video w-full rounded-lg" />
              <Skeleton className="h-4 w-3/4 rounded-md" />
              <Skeleton className="h-3 w-1/2 rounded-md" />
              <Skeleton className="h-10 w-full rounded-md mt-auto" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
