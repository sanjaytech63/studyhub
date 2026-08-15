interface NotificationsHeaderProps {
  readonly unreadCount: number;
  readonly onMarkAllAsRead?: () => void;
}

export function NotificationsHeader({ unreadCount, onMarkAllAsRead }: NotificationsHeaderProps) {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <div className="flex items-center gap-2">
          <h1
            id="notifications-title"
            className="text-2xl font-semibold tracking-tight sm:text-3xl"
          >
            Notifications
          </h1>

          {unreadCount > 0 ? (
            <span className="inline-flex min-w-6 items-center justify-center rounded-full bg-primary px-2 py-0.5 text-xs font-semibold text-primary-foreground">
              {unreadCount}
            </span>
          ) : null}
        </div>

        <p className="mt-1.5 text-sm text-muted-foreground sm:text-base">
          Stay updated with your latest activity and account updates.
        </p>
      </div>

      {unreadCount > 0 && onMarkAllAsRead ? (
        <button
          type="button"
          onClick={onMarkAllAsRead}
          className="w-fit text-sm font-medium text-primary transition-colors hover:text-primary/80 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2"
        >
          Mark all as read
        </button>
      ) : null}
    </header>
  );
}
