import type { NotificationItem } from '@/lib/notifications/notifications.types';
import { NotificationItem as NotificationItemComponent } from './notification-item';
interface NotificationGroupProps {
  readonly title: string;
  readonly notifications: readonly NotificationItem[];
  readonly onRead: (id: string) => void;
}

export function NotificationGroup({ title, notifications, onRead }: NotificationGroupProps) {
  if (notifications.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby={`notification-group-${title}`}>
      <div className="mb-2 flex items-center gap-3 px-1">
        <h2
          id={`notification-group-${title}`}
          className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
        >
          {title}
        </h2>

        <div className="h-px flex-1 bg-border/60" />
      </div>

      <div className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm">
        <div className="divide-y divide-border/60">
          {notifications.map((notification) => (
            <NotificationItemComponent
              key={notification.id}
              notification={notification}
              onRead={onRead}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
