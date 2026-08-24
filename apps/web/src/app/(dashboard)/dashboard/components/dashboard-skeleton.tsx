import { Skeleton } from '@/components/ui/skeleton';

export function DashboardSkeleton() {
  return (
    <section aria-label="Loading dashboard" className="mx-auto w-full max-w-7xl space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-3">
          <Skeleton className="h-5 w-32 rounded-full" />
          <Skeleton className="h-10 w-72 max-w-full" />
          <Skeleton className="h-5 w-105 max-w-full" />
        </div>

        <Skeleton className="h-10 w-40 rounded-lg" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-40 rounded-xl" />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <Skeleton className="h-134 rounded-xl" />

        <div className="space-y-6">
          <Skeleton className="h-64 rounded-xl" />
          <Skeleton className="h-64 rounded-xl" />
        </div>
      </div>

      <Skeleton className="h-72 rounded-xl" />
    </section>
  );
}
