'use client';

import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { notificationsQueryOptions } from '@/lib/notifications/notifications.queries';
import {
  useMarkAllNotificationsAsReadMutation,
  useMarkNotificationAsReadMutation,
} from '@/lib/notifications/notifications.mutations';
import type { NotificationItem, NotificationType } from '@/lib/notifications/notifications.types';

import { NotificationEmpty } from './notification-empty';
import { NotificationGroup } from './notification-group';
import { NotificationSkeleton } from './notification-skeleton';
import { NotificationToolbar } from './notification-toolbar';
import { NotificationsHeader } from './notifications-header';

type NotificationFilter = NotificationType | 'all';

interface GroupedNotifications {
  readonly today: readonly NotificationItem[];
  readonly yesterday: readonly NotificationItem[];
  readonly earlier: readonly NotificationItem[];
}

export function NotificationsPage() {
  const [selectedType, setSelectedType] = useState<NotificationFilter>('all');
  const [unreadOnly, setUnreadOnly] = useState(false);

  const filters = useMemo(
    () => ({
      ...(selectedType !== 'all' ? { type: selectedType } : {}),
      ...(unreadOnly ? { unreadOnly: true } : {}),
    }),
    [selectedType, unreadOnly],
  );

  const notificationsQuery = useQuery(notificationsQueryOptions(filters));
  const markAsReadMutation = useMarkNotificationAsReadMutation();
  const markAllAsReadMutation = useMarkAllNotificationsAsReadMutation();
  const EMPTY_NOTIFICATIONS: readonly NotificationItem[] = [];
  const notifications = notificationsQuery.data ?? EMPTY_NOTIFICATIONS;

  const groupedNotifications = useMemo(() => groupNotifications(notifications), [notifications]);
  const unreadCount = notifications.filter((notification) => !notification.isRead).length;

  function handleMarkAsRead(id: string) {
    markAsReadMutation.mutate(id);
  }

  function handleMarkAllAsRead() {
    if (unreadCount === 0) {
      return;
    }

    markAllAsReadMutation.mutate();
  }

  /*
   * --------------------------------------------------------------------------
   * Loading
   * --------------------------------------------------------------------------
   */

  if (notificationsQuery.isPending) {
    return (
      <section aria-labelledby="notifications-title" className="mx-auto w-full max-w-5xl space-y-6">
        <NotificationsHeader unreadCount={0} onMarkAllAsRead={() => undefined} />
        <NotificationSkeleton />
      </section>
    );
  }

  /*
   * --------------------------------------------------------------------------
   * Error
   * --------------------------------------------------------------------------
   */

  if (notificationsQuery.isError) {
    return (
      <section aria-labelledby="notifications-title" className="mx-auto w-full max-w-5xl space-y-6">
        <NotificationsHeader unreadCount={0} onMarkAllAsRead={() => undefined} />
        <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6">
          <h2 className="text-sm font-semibold">Unable to load notifications</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Something went wrong while loading your notifications.
          </p>

          <button
            type="button"
            onClick={() => void notificationsQuery.refetch()}
            className={[
              'mt-4 text-sm font-medium text-primary',
              'hover:underline',
              'focus-visible:outline-none',
              'focus-visible:ring-2',
              'focus-visible:ring-primary/40',
              'focus-visible:ring-offset-2',
            ].join(' ')}
          >
            Try again
          </button>
        </div>
      </section>
    );
  }

  /*
   * --------------------------------------------------------------------------
   * Success
   * --------------------------------------------------------------------------
   */

  return (
    <section aria-labelledby="notifications-title" className="w-full space-y-6">
      <NotificationsHeader unreadCount={unreadCount} onMarkAllAsRead={handleMarkAllAsRead} />

      <NotificationToolbar
        selectedType={selectedType}
        unreadOnly={unreadOnly}
        unreadCount={unreadCount}
        onTypeChange={setSelectedType}
        onUnreadOnlyChange={setUnreadOnly}
        onMarkAllAsRead={handleMarkAllAsRead}
      />

      {notifications.length === 0 ? (
        <NotificationEmpty />
      ) : (
        <div className="space-y-6">
          <NotificationGroup
            title="Today"
            notifications={groupedNotifications.today}
            onRead={handleMarkAsRead}
          />

          <NotificationGroup
            title="Yesterday"
            notifications={groupedNotifications.yesterday}
            onRead={handleMarkAsRead}
          />

          <NotificationGroup
            title="Earlier"
            notifications={groupedNotifications.earlier}
            onRead={handleMarkAsRead}
          />
        </div>
      )}
    </section>
  );
}

/**
 * Groups notifications into human-readable date buckets.
 *
 * Internal arrays are intentionally mutable while building the
 * result. The returned object exposes readonly arrays so consumers
 * cannot accidentally mutate notification state.
 */
function groupNotifications(notifications: readonly NotificationItem[]): GroupedNotifications {
  const now = new Date();
  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);
  const yesterdayStart = new Date(todayStart);
  yesterdayStart.setDate(yesterdayStart.getDate() - 1);
  const today: NotificationItem[] = [];
  const yesterday: NotificationItem[] = [];
  const earlier: NotificationItem[] = [];

  for (const notification of notifications) {
    const date = new Date(notification.createdAt);

    /*
     * Ignore malformed dates instead of incorrectly putting
     * them into the "Today" group.
     */
    if (Number.isNaN(date.getTime())) {
      earlier.push(notification);
      continue;
    }

    if (date >= todayStart) {
      today.push(notification);
      continue;
    }

    if (date >= yesterdayStart) {
      yesterday.push(notification);
      continue;
    }

    earlier.push(notification);
  }

  return {
    today,
    yesterday,
    earlier,
  };
}
