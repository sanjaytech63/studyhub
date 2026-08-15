export function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <div className="h-7 w-32 animate-pulse rounded-md bg-muted" />

        <div className="h-4 w-72 animate-pulse rounded-md bg-muted" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-32 animate-pulse rounded-xl border border-border/70 bg-muted/50"
          />
        ))}
      </div>

      <div className="space-y-4">
        <div className="h-6 w-40 animate-pulse rounded-md bg-muted" />

        <div className="grid gap-5 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="h-80 animate-pulse rounded-xl border border-border/70 bg-muted/50"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
