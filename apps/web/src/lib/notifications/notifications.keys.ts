import type { NotificationType } from './notifications.types';

export const notificationKeys = {
  all: ['notifications'] as const,
  lists: () => [...notificationKeys.all, 'list'] as const,
  list: (filters?: { readonly type?: NotificationType; readonly unreadOnly?: boolean }) =>
    [...notificationKeys.lists(), filters ?? {}] as const,
  unreadCount: () => [...notificationKeys.all, 'unread-count'] as const,
  detail: (id: string) => [...notificationKeys.all, 'detail', id] as const,
};
