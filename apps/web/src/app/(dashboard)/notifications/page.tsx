'use client';

import { useState } from 'react';
import { BellOff } from 'lucide-react';
import { EmptyState } from '@/components/feedback/empty-state';
import { notifications as initialNotifications } from '@/lib/notifications/notifications.data';
import type { NotificationItem } from '@/lib/notifications/notifications.types';
import { NotificationsHeader } from './components/notifications-header';
import { NotificationList } from './components/notification-list';

export default function NotificationsPage() {
  const [notifications, setNotifications] =
    useState<readonly NotificationItem[]>(initialNotifications);

  const unreadCount = notifications.filter((notification) => !notification.isRead).length;

  function handleMarkAsRead(id: string) {
    setNotifications((currentNotifications) =>
      currentNotifications.map((notification) =>
        notification.id === id
          ? {
              ...notification,
              isRead: true,
            }
          : notification,
      ),
    );
  }

  function handleMarkAllAsRead() {
    setNotifications((currentNotifications) =>
      currentNotifications.map((notification) => ({
        ...notification,
        isRead: true,
      })),
    );
  }

  return (
    <section aria-labelledby="notifications-title" className="mx-auto w-full max-w-7xl space-y-6">
      <NotificationsHeader unreadCount={unreadCount} onMarkAllAsRead={handleMarkAllAsRead} />

      {notifications.length === 0 ? (
        <EmptyState
          title="You're all caught up"
          message="You don't have any new notifications right now. We'll let you know when something needs your attention."
          icon={<BellOff className="size-5" />}
        />
      ) : (
        <NotificationList notifications={notifications} onRead={handleMarkAsRead} />
      )}
    </section>
  );
}
