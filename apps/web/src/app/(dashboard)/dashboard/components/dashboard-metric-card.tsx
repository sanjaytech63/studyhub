import type { ReactNode } from 'react';

interface DashboardMetricCardProps {
  readonly label: string;
  readonly value: string;
  readonly description?: string;
  readonly icon?: ReactNode;
}

export function DashboardMetricCard({ label, value, description, icon }: DashboardMetricCardProps) {
  return (
    <article className="rounded-xl border border-border/70 bg-card p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm text-muted-foreground">{label}</p>

          <p className="mt-2 text-2xl font-semibold tracking-tight">{value}</p>

          {description ? <p className="mt-1 text-xs text-muted-foreground">{description}</p> : null}
        </div>

        {icon ? (
          <div
            aria-hidden="true"
            className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted"
          >
            {icon}
          </div>
        ) : null}
      </div>
    </article>
  );
}
