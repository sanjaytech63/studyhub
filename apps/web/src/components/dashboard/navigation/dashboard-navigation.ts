import { Bell, BookOpen, FolderKanban, LayoutDashboard, Settings, UserRound } from 'lucide-react';

import type { LucideIcon } from 'lucide-react';

export interface DashboardNavigationItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export const dashboardNavigation: DashboardNavigationItem[] = [
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
];
