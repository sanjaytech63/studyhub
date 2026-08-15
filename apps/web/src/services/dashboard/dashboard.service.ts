import { apiClient } from '@/lib/api/api-client';
import type { DashboardData } from '@/lib/dashboard/dashboard.types';

export async function getDashboard(): Promise<DashboardData> {
  const response = await apiClient.get<DashboardData>('/dashboard');
  return response.data;
}
