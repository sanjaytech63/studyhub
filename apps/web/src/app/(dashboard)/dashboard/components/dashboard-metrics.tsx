import { Award, BookOpen, Clock3, FolderKanban } from 'lucide-react';

import type { DashboardMetric } from '@/lib/dashboard/dashboard.types';
import { DashboardMetricCard } from './dashboard-metric-card';

interface DashboardMetricsProps {
  readonly metrics: readonly DashboardMetric[];
}

const METRIC_ICONS = [BookOpen, Clock3, FolderKanban, Award] as const;

export function DashboardMetrics({ metrics }: DashboardMetricsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric, index) => {
        const Icon = METRIC_ICONS[index % METRIC_ICONS.length] ?? BookOpen;

        return (
          <DashboardMetricCard
            key={metric.id}
            label={metric.label}
            value={metric.value}
            description={metric.description}
            icon={Icon}
            highlight={index === 0}
          />
        );
      })}
    </div>
  );
}
