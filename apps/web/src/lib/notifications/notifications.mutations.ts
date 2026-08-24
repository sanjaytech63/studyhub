import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { NotificationItem } from './notifications.types';

import { notificationKeys } from './notifications.keys';

interface MarkNotificationReadContext {
  readonly previousNotifications: readonly NotificationItem[] | undefined;
}

async function markNotificationAsRead(id: string): Promise<void> {
  // Temporary implementation.
  //
  // Replace with:
  //
  // await apiClient.patch(
  //   `/notifications/${id}/read`,
  // );
  //
  // when backend API is available.

  void id;
}

async function markAllNotificationsAsRead(): Promise<void> {
  // Temporary implementation.
  //
  // Replace with:
  //
  // await apiClient.post('/notifications/read-all');
}

export function useMarkNotificationAsReadMutation() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string, MarkNotificationReadContext>({
    mutationKey: [...notificationKeys.all, 'mark-read'],

    mutationFn: markNotificationAsRead,

    onMutate: async (id) => {
      await queryClient.cancelQueries({
        queryKey: notificationKeys.lists(),
      });

      const previousNotifications = queryClient.getQueryData<readonly NotificationItem[]>(
        notificationKeys.list(),
      );

      queryClient.setQueryData<readonly NotificationItem[]>(notificationKeys.list(), (current) =>
        current?.map((notification) =>
          notification.id === id
            ? {
                ...notification,
                isRead: true,
              }
            : notification,
        ),
      );

      queryClient.setQueryData(notificationKeys.unreadCount(), (current: number | undefined) =>
        Math.max((current ?? 1) - 1, 0),
      );

      return {
        previousNotifications,
      };
    },

    onError: (_error, _id, context) => {
      if (!context) {
        return;
      }

      queryClient.setQueryData(notificationKeys.list(), context.previousNotifications);
    },

    onSettled: () => {
      void queryClient.invalidateQueries({
        queryKey: notificationKeys.lists(),
      });

      void queryClient.invalidateQueries({
        queryKey: notificationKeys.unreadCount(),
      });
    },
  });
}

export function useMarkAllNotificationsAsReadMutation() {
  const queryClient = useQueryClient();

  return useMutation<
    void,
    Error,
    void,
    {
      readonly previousNotifications: readonly NotificationItem[] | undefined;
    }
  >({
    mutationKey: [...notificationKeys.all, 'mark-all-read'],

    mutationFn: markAllNotificationsAsRead,

    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: notificationKeys.lists(),
      });

      const previousNotifications = queryClient.getQueryData<readonly NotificationItem[]>(
        notificationKeys.list(),
      );

      queryClient.setQueryData<readonly NotificationItem[]>(notificationKeys.list(), (current) =>
        current?.map((notification) => ({
          ...notification,
          isRead: true,
        })),
      );

      queryClient.setQueryData(notificationKeys.unreadCount(), 0);

      return {
        previousNotifications,
      };
    },

    onError: (_error, _variables, context) => {
      if (!context) {
        return;
      }

      queryClient.setQueryData(notificationKeys.list(), context.previousNotifications);
    },

    onSettled: () => {
      void queryClient.invalidateQueries({
        queryKey: notificationKeys.lists(),
      });

      void queryClient.invalidateQueries({
        queryKey: notificationKeys.unreadCount(),
      });
    },
  });
}
