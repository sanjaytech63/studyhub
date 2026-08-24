import type { NotificationItem } from './notifications.types';

export const notifications: readonly NotificationItem[] = [
  {
    id: 'notification-1',
    type: 'learning',
    title: 'Continue your React course',
    message: 'You are making great progress. Continue where you left off.',
    isRead: false,
    createdAt: '2026-08-24T07:30:00.000Z',
    href: '/learning/react',
    metadata: {
      courseName: 'Advanced React',
      lessonName: 'React Server Components',
    },
  },

  {
    id: 'notification-2',
    type: 'achievement',
    title: 'New achievement unlocked',
    message: 'You completed 10 lessons this week. Keep the momentum going.',
    isRead: false,
    createdAt: '2026-08-24T06:15:00.000Z',
    href: '/achievements',
    metadata: {
      achievementName: '10 Lessons Completed',
    },
  },

  {
    id: 'notification-3',
    type: 'course',
    title: 'Course content updated',
    message: 'New lessons have been added to Advanced Node.js.',
    isRead: true,
    createdAt: '2026-08-23T14:30:00.000Z',
    href: '/learning/nodejs',
    metadata: {
      courseName: 'Advanced Node.js',
    },
  },

  {
    id: 'notification-4',
    type: 'announcement',
    title: 'Welcome to StudyHub',
    message: 'Explore courses, track your progress, and build your learning habit.',
    isRead: true,
    createdAt: '2026-08-22T09:00:00.000Z',
    href: '/dashboard',
  },
];
