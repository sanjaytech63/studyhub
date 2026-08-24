'use client';

import { useQuery } from '@tanstack/react-query';
import { ApiErrorState } from '@/components/feedback/api-error-state';
import { dashboardQueryOptions } from '@/lib/dashboard/dashboard.queries';
import { ContinueLearning } from './components/continue-learning';
import { DashboardHeader } from './components/dashboard-header';
import { DashboardMetrics } from './components/dashboard-metrics';
import { QuickActions } from './components/quick-actions';
import { RecentActivity } from './components/recent-activity';
import { DashboardSkeleton } from './components/dashboard-skeleton';

export default function DashboardPage() {
  const dashboardQuery = useQuery(dashboardQueryOptions);

  if (dashboardQuery.isPending) {
    return <DashboardSkeleton />;
  }

  if (dashboardQuery.isError) {
    return (
      <DashboardError
        error={dashboardQuery.error}
        onRetry={() => {
          void dashboardQuery.refetch();
        }}
      />
    );
  }

  const dashboard = dashboardQuery.data;

  return (
    <section aria-labelledby="dashboard-title" className="mx-auto w-full max-w-7xl space-y-8">
      <DashboardHeader />
      <DashboardMetrics metrics={dashboard.metrics} />
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <ContinueLearning courses={dashboard.continueLearning} />
        <QuickActions />
      </div>
      <RecentActivity />
    </section>
  );
}

interface DashboardErrorProps {
  readonly error: unknown;
  readonly onRetry: () => void;
}

function DashboardError({ error, onRetry }: DashboardErrorProps) {
  return (
    <section className="mx-auto w-full max-w-7xl space-y-6">
      <DashboardHeader />
      <ApiErrorState error={error} title="Unable to load your dashboard" onRetry={onRetry} />
    </section>
  );
}
