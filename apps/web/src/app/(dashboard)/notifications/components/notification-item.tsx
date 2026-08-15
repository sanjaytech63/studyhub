import Link from 'next/link';
import { Award, Bell, BookOpen, LockKeyhole, UserRound } from 'lucide-react';

import { cn } from '@/lib/utils';

import type { NotificationItem as NotificationItemType } from '@/lib/notifications/notifications.types';

interface NotificationItemProps {
  readonly notification: NotificationItemType;
  readonly onRead?: (id: string) => void;
}

const notificationIcons = {
  course: BookOpen,
  achievement: Award,
  system: Bell,
  security: LockKeyhole,
  account: UserRound,
} as const;

export function NotificationItem({ notification, onRead }: NotificationItemProps) {
  const Icon = notificationIcons[notification.type];

  const content = (
    <div
      className={cn(
        'flex gap-4 p-4 transition-colors sm:p-5',
        'hover:bg-muted/40',
        !notification.isRead && 'bg-primary/3',
      )}
    >
      <div className="relative shrink-0">
        <div
          className={cn(
            'flex size-10 items-center justify-center rounded-xl',
            notification.isRead ? 'bg-muted text-muted-foreground' : 'bg-primary/10 text-primary',
          )}
        >
          <Icon aria-hidden="true" className="size-5" />
        </div>

        {!notification.isRead ? (
          <span
            aria-label="Unread"
            className="absolute -right-0.5 -top-0.5 size-2.5 rounded-full bg-primary ring-2 ring-card"
          />
        ) : null}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
          <h3
            className={cn(
              'text-sm leading-5',
              notification.isRead ? 'font-medium text-foreground' : 'font-semibold text-foreground',
            )}
          >
            {notification.title}
          </h3>

          <time
            dateTime={notification.createdAt}
            className="shrink-0 text-xs text-muted-foreground"
          >
            {notification.createdAt}
          </time>
        </div>

        <p className="mt-1 text-sm leading-6 text-muted-foreground">{notification.message}</p>

        {!notification.isRead ? (
          <span className="mt-2 inline-flex items-center text-xs font-medium text-primary">
            New
          </span>
        ) : null}
      </div>
    </div>
  );

  if (!notification.href) {
    return (
      <article
        className="border-b border-border/60 last:border-b-0"
        onClick={() => onRead?.(notification.id)}
      >
        {content}
      </article>
    );
  }

  return (
    <article className="border-b border-border/60 last:border-b-0">
      <Link
        href={notification.href}
        onClick={() => onRead?.(notification.id)}
        className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary/40"
      >
        {content}
      </Link>
    </article>
  );
}
