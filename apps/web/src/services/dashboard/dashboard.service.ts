import { getMySessions, getProfile } from '@/services/profile/profile.service';
import type { DashboardData, DashboardMetric } from '@/lib/dashboard/dashboard.types';

export async function getDashboard(): Promise<DashboardData> {
  const [profile, sessions] = await Promise.all([getProfile(), getMySessions().catch(() => [])]);

  const metrics: readonly DashboardMetric[] = [
    {
      id: 'account-status',
      label: 'Account Status',
      value: profile.status,
      description: 'Account operational status',
    },
    {
      id: 'role',
      label: 'Role',
      value: profile.role.name,
      description: 'Current access level',
    },
    {
      id: 'active-sessions',
      label: 'Active Sessions',
      value: String(sessions.length || 1),
      description: 'Devices currently signed in',
    },
    {
      id: 'verification',
      label: 'Email Verified',
      value: profile.emailVerifiedAt ? 'Verified' : 'Pending',
      description: 'Account verification state',
    },
  ];

  return {
    metrics,
    continueLearning: [],
  };
}
