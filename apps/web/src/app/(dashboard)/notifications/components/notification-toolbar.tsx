'use client';

import { CheckCheck, Filter, SlidersHorizontal } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';

import type { NotificationType } from '@/lib/notifications/notifications.types';

interface NotificationToolbarProps {
  readonly selectedType: NotificationType | 'all';
  readonly unreadOnly: boolean;
  readonly unreadCount: number;
  readonly onTypeChange: (type: NotificationType | 'all') => void;
  readonly onUnreadOnlyChange: (value: boolean) => void;
  readonly onMarkAllAsRead: () => void;
}

const FILTERS: readonly {
  readonly value: NotificationType | 'all';
  readonly label: string;
}[] = [
  {
    value: 'all',
    label: 'All',
  },
  {
    value: 'learning',
    label: 'Learning',
  },
  {
    value: 'course',
    label: 'Courses',
  },
  {
    value: 'achievement',
    label: 'Achievements',
  },
  {
    value: 'announcement',
    label: 'Announcements',
  },
  {
    value: 'system',
    label: 'System',
  },
];

export function NotificationToolbar({
  selectedType,
  unreadOnly,
  unreadCount,
  onTypeChange,
  onUnreadOnlyChange,
  onMarkAllAsRead,
}: NotificationToolbarProps) {
  return (
    <div className="rounded-2xl border border-border/70 bg-card p-3 shadow-sm">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 items-center gap-2 overflow-x-auto pb-1 lg:pb-0">
          <div className="mr-1 flex shrink-0 items-center gap-2 text-xs font-medium text-muted-foreground">
            <Filter className="size-4" />
            <span className="hidden sm:inline">Filter</span>
          </div>

          {FILTERS.map((filter) => {
            const selected = selectedType === filter.value;

            return (
              <Button
                key={filter.value}
                type="button"
                variant={selected ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => onTypeChange(filter.value)}
                className="shrink-0 rounded-lg"
              >
                {filter.label}
              </Button>
            );
          })}
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-border/60 pt-3 lg:border-t-0 lg:pt-0">
          <label className="flex cursor-pointer items-center gap-2">
            <Switch
              checked={unreadOnly}
              onCheckedChange={onUnreadOnlyChange}
              aria-label="Show unread notifications only"
            />

            <span className="text-xs font-medium">Unread only</span>
          </label>

          {unreadCount > 0 && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onMarkAllAsRead}
              className="gap-2"
            >
              <CheckCheck className="size-4" />

              <span className="hidden sm:inline">Mark all read</span>

              <Badge variant="secondary" className="rounded-full">
                {unreadCount}
              </Badge>
            </Button>
          )}
        </div>
      </div>

      <div className="mt-3 hidden items-center gap-2 border-t border-border/60 pt-3 text-xs text-muted-foreground sm:flex">
        <SlidersHorizontal className="size-3.5" />
        <span>Manage notification behavior from Settings.</span>
      </div>
    </div>
  );
}
