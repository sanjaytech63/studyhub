import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';

export function CourseEditSkeleton() {
  return (
    <div className="space-y-8 pb-16 max-w-7xl mx-auto animate-pulse">
      {/* Top Bar Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10 rounded-xl" />
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Skeleton className="h-7 w-64 rounded-lg" />
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>
            <Skeleton className="h-4 w-40 rounded-md" />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-28 rounded-lg" />
          <Skeleton className="h-10 w-36 rounded-lg" />
        </div>
      </div>

      {/* Grid Layout Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Content (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <Card className="p-6 space-y-6">
            <div className="space-y-2">
              <Skeleton className="h-5 w-48 rounded-md" />
              <Skeleton className="h-3.5 w-72 rounded-md" />
            </div>
            <div className="space-y-4 pt-2">
              <Skeleton className="h-10 w-full rounded-lg" />
              <div className="grid grid-cols-2 gap-4">
                <Skeleton className="h-10 w-full rounded-lg" />
                <Skeleton className="h-10 w-full rounded-lg" />
              </div>
              <Skeleton className="h-24 w-full rounded-lg" />
            </div>
          </Card>

          <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-40 rounded-md" />
              <Skeleton className="h-9 w-28 rounded-lg" />
            </div>
            <Skeleton className="h-28 w-full rounded-xl" />
            <Skeleton className="h-28 w-full rounded-xl" />
          </Card>
        </div>

        {/* Sidebar (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="p-6 space-y-4">
            <Skeleton className="h-4 w-32 rounded-md" />
            <Skeleton className="h-12 w-full rounded-lg" />
            <Skeleton className="h-20 w-full rounded-lg" />
          </Card>
          <Card className="p-6 space-y-4">
            <Skeleton className="h-4 w-32 rounded-md" />
            <Skeleton className="h-36 w-full rounded-xl" />
            <Skeleton className="h-28 w-full rounded-xl" />
          </Card>
        </div>
      </div>
    </div>
  );
}
