import type { DashboardMetric } from '@/lib/dashboard/dashboard.types';
import { DashboardMetricCard } from './dashboard-metric-card';
interface DashboardMetricsProps {
  readonly metrics: readonly DashboardMetric[];
}

export function DashboardMetrics({ metrics }: DashboardMetricsProps) {
  return (
    <section aria-label="Learning statistics" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => (
        <DashboardMetricCard
          key={metric.id}
          label={metric.label}
          value={metric.value}
          description={metric.description}
        />
      ))}
    </section>
  );
}
