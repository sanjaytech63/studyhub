import { Skeleton } from '@/components/ui/skeleton';

export function NotificationSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border/70 bg-card">
      <div className="divide-y divide-border/60">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="flex gap-4 px-4 py-4 sm:px-5">
            <Skeleton className="size-10 shrink-0 rounded-xl" />

            <div className="min-w-0 flex-1 space-y-2">
              <Skeleton className="h-4 w-2/5" />
              <Skeleton className="h-4 w-4/5" />
              <Skeleton className="h-3 w-20" />
            </div>

            <Skeleton className="h-3 w-10" />
          </div>
        ))}
      </div>
    </div>
  );
}
