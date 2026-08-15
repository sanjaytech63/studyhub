import { Bell, BookOpen, FolderKanban, LayoutDashboard, Settings, UserRound } from 'lucide-react';
import type { DashboardMetric, DashboardUser, NavigationSection } from './dashboard.types';

export const dashboardNavigation: readonly NavigationSection[] = [
  {
    label: 'Overview',
    items: [
      {
        label: 'Dashboard',
        href: '/dashboard',
        icon: LayoutDashboard,
      },
      {
        label: 'Learning',
        href: '/learning',
        icon: BookOpen,
      },
      {
        label: 'Projects',
        href: '/projects',
        icon: FolderKanban,
      },
    ],
  },
  {
    label: 'Account',
    items: [
      {
        label: 'Notifications',
        href: '/notifications',
        icon: Bell,
      },
      {
        label: 'Profile',
        href: '/profile',
        icon: UserRound,
      },
      {
        label: 'Settings',
        href: '/settings',
        icon: Settings,
      },
    ],
  },
];

export const temporaryDashboardUser: DashboardUser = {
  id: 'user-1',
  name: 'Sanjay Choudhary',
  email: 'sanjay@example.com',
};

export const dashboardMetrics: readonly DashboardMetric[] = [
  {
    id: 'courses',
    label: 'Courses',
    value: '0',
  },
  {
    id: 'learning-hours',
    label: 'Learning Hours',
    value: '0',
  },
  {
    id: 'projects',
    label: 'Projects',
    value: '0',
  },
  {
    id: 'achievements',
    label: 'Achievements',
    value: '0',
  },
];
