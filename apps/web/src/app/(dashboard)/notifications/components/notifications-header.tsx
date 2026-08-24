'use client';

import { CheckCheck, Filter, Settings2 } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface NotificationsHeaderProps {
  readonly unreadCount: number;
  readonly onMarkAllAsRead: () => void;
}

export function NotificationsHeader({ unreadCount, onMarkAllAsRead }: NotificationsHeaderProps) {
  return (
    <header className="flex flex-col gap-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1
              id="notifications-title"
              className="text-2xl font-semibold tracking-tight sm:text-3xl"
            >
              Notifications
            </h1>

            {unreadCount > 0 && (
              <Badge variant="secondary" className="rounded-full px-2.5">
                {unreadCount} new
              </Badge>
            )}
          </div>

          <p className="mt-1.5 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
            Stay up to date with your learning activity, achievements, and important StudyHub
            updates.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="size-4" />
            Filter
          </Button>

          <Button variant="outline" size="sm" className="gap-2">
            <Link href="/settings" className="flex gap-2">
              <Settings2 className="size-4" />
              Preferences
            </Link>
          </Button>
        </div>
      </div>

      {unreadCount > 0 && (
        <div className="flex items-center justify-between rounded-xl border border-primary/10 bg-primary/[0.035] px-4 py-3">
          <div>
            <p className="text-sm font-medium">You have unread notifications</p>

            <p className="mt-0.5 text-xs text-muted-foreground">
              Review them to keep your learning activity up to date.
            </p>
          </div>

          <Button variant="ghost" size="sm" onClick={onMarkAllAsRead} className="gap-2">
            <CheckCheck className="size-4" />
            <span className="hidden sm:inline">Mark all as read</span>
            <span className="sm:hidden">Mark all</span>
          </Button>
        </div>
      )}
    </header>
  );
}
