export default function NotificationsPage() {
  return (
    <section aria-labelledby="notifications-title" className="space-y-6">
      <div>
        <h1 id="notifications-title" className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Notifications
        </h1>

        <p className="mt-1.5 text-sm text-muted-foreground sm:text-base">
          Stay updated with your latest activity.
        </p>
      </div>

      <div className="rounded-xl border border-dashed border-border bg-card p-8 text-center">
        <h2 className="text-sm font-semibold">You&apos;re all caught up</h2>

        <p className="mt-1 text-sm text-muted-foreground">New notifications will appear here.</p>
      </div>
    </section>
  );
}
