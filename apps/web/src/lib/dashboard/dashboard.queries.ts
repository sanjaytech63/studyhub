import { queryOptions } from '@tanstack/react-query';
import { getDashboard } from '@/services/dashboard/dashboard.service';
import { dashboardKeys } from './dashboard.keys';

export const dashboardQueryOptions = queryOptions({
  queryKey: dashboardKeys.overview(),
  queryFn: getDashboard,
});
