import type { NotificationItem } from '@/lib/notifications/notifications.types';

import { NotificationItem as NotificationItemComponent } from './notification-item';

interface NotificationListProps {
  readonly notifications: readonly NotificationItem[];
  readonly onRead?: (id: string) => void;
}

export function NotificationList({ notifications, onRead }: NotificationListProps) {
  return (
    <section
      aria-label="Your notifications"
      className="overflow-hidden rounded-xl border border-border/70 bg-card shadow-sm"
    >
      <div className="divide-y divide-border/60">
        {notifications.map((notification) => (
          <NotificationItemComponent
            key={notification.id}
            notification={notification}
            onRead={onRead}
          />
        ))}
      </div>
    </section>
  );
}
