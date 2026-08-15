import type { NotificationItem } from './notifications.types';

export const notifications: readonly NotificationItem[] = [
  {
    id: 'notification-1',
    type: 'course',
    title: 'Course progress updated',
    message: 'You completed 60% of Full Stack Web Development. Keep going!',
    createdAt: '2 hours ago',
    href: '/learning/full-stack-web-development',
    isRead: false,
  },
  {
    id: 'notification-2',
    type: 'achievement',
    title: 'New achievement unlocked',
    message: 'Congratulations! You completed your first learning milestone.',
    createdAt: 'Yesterday',
    href: '/achievements',
    isRead: false,
  },
  {
    id: 'notification-3',
    type: 'system',
    title: 'New course available',
    message: 'A new React Native course is now available in your learning library.',
    createdAt: '2 days ago',
    href: '/learning',
    isRead: true,
  },
];
