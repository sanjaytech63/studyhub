'use client';

import Link from 'next/link';
import { Check } from 'lucide-react';

import { cn } from '@/lib/utils';

import { NOTIFICATION_TYPE_CONFIG } from '@/lib/notifications/notifications.config';
import type { NotificationItem as NotificationItemType } from '@/lib/notifications/notifications.types';

interface NotificationItemProps {
  readonly notification: NotificationItemType;
  readonly onRead: (id: string) => void;
}

export function NotificationItem({ notification, onRead }: NotificationItemProps) {
  const config = NOTIFICATION_TYPE_CONFIG[notification.type];

  const Icon = config.icon;

  const content = (
    <div
      className={cn(
        'group relative flex gap-4 px-4 py-4 sm:px-5',
        'transition-colors duration-150',
        'hover:bg-muted/40',
        !notification.isRead && 'bg-primary/[0.035]',
      )}
    >
      {!notification.isRead && (
        <span aria-hidden="true" className="absolute left-0 top-0 h-full w-0.5 bg-primary" />
      )}

      <div
        className={cn(
          'flex size-10 shrink-0 items-center justify-center',
          'rounded-xl',
          'border',
          notification.isRead
            ? 'border-border/70 bg-muted text-muted-foreground'
            : 'border-primary/20 bg-primary/10 text-primary',
        )}
      >
        <Icon aria-hidden="true" className="size-5" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p
                className={cn(
                  'text-sm leading-5',
                  notification.isRead ? 'font-medium' : 'font-semibold',
                )}
              >
                {notification.title}
              </p>

              {!notification.isRead && (
                <span aria-label="Unread" className="size-1.5 rounded-full bg-primary" />
              )}
            </div>

            <p className="mt-1 text-sm leading-5 text-muted-foreground">{notification.message}</p>
          </div>

          <time
            dateTime={notification.createdAt}
            className="shrink-0 text-xs text-muted-foreground"
          >
            {formatRelativeTime(notification.createdAt)}
          </time>
        </div>

        <div className="mt-3 flex items-center justify-between gap-3">
          <span className="text-xs font-medium text-muted-foreground">{config.label}</span>

          <button
            type="button"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              onRead(notification.id);
            }}
            disabled={notification.isRead}
            className={cn(
              'inline-flex items-center gap-1.5',
              'text-xs font-medium',
              'text-muted-foreground',
              'transition-colors',
              'hover:text-foreground',
              'disabled:pointer-events-none disabled:opacity-0',
            )}
          >
            <Check className="size-3.5" />
            Mark as read
          </button>
        </div>
      </div>
    </div>
  );

  if (!notification.href) {
    return content;
  }

  return (
    <Link
      href={notification.href}
      onClick={() => {
        if (!notification.isRead) {
          onRead(notification.id);
        }
      }}
      className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-inset"
    >
      {content}
    </Link>
  );
}

function formatRelativeTime(value: string): string {
  const date = new Date(value);
  const now = new Date();

  const difference = now.getTime() - date.getTime();

  const minutes = Math.floor(difference / (1000 * 60));

  if (minutes < 1) {
    return 'Just now';
  }

  if (minutes < 60) {
    return `${minutes}m`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `${hours}h`;
  }

  const days = Math.floor(hours / 24);

  if (days < 7) {
    return `${days}d`;
  }

  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });
}
