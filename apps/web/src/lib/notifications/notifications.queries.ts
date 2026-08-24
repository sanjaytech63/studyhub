import { queryOptions } from '@tanstack/react-query';
import { notifications } from './notifications.data';
import { notificationKeys } from './notifications.keys';
import type { NotificationItem, NotificationType } from './notifications.types';

interface NotificationFilters {
  readonly type?: NotificationType;
  readonly unreadOnly?: boolean;
}

async function getNotifications(
  filters?: NotificationFilters,
): Promise<readonly NotificationItem[]> {
  // Temporary implementation.
  //
  // Replace this function with:
  //
  // apiClient.get('/notifications', {
  //   params: filters,
  // })
  //
  // when the backend endpoint is ready.

  let result = [...notifications];

  if (filters?.type) {
    result = result.filter((notification) => notification.type === filters.type);
  }

  if (filters?.unreadOnly) {
    result = result.filter((notification) => !notification.isRead);
  }

  return result;
}

export function notificationsQueryOptions(filters?: NotificationFilters) {
  return queryOptions({
    queryKey: notificationKeys.list(filters),
    queryFn: () => getNotifications(filters),
  });
}

export function unreadNotificationsCountQueryOptions() {
  return queryOptions({
    queryKey: notificationKeys.unreadCount(),
    queryFn: async () => {
      const result = await getNotifications({
        unreadOnly: true,
      });
      return result.length;
    },
  });
}
