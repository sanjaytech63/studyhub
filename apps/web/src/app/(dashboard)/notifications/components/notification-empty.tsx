import { BellOff } from 'lucide-react';

export function NotificationEmpty() {
  return (
    <div className="flex min-h-105 flex-col items-center justify-center rounded-2xl border border-dashed border-border/80 bg-card px-6 text-center">
      <div className="flex size-14 items-center justify-center rounded-2xl bg-muted">
        <BellOff className="size-6 text-muted-foreground" />
      </div>

      <h2 className="mt-5 text-base font-semibold">Youre all caught up</h2>

      <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
        There are no new notifications right now. Well let you know when something needs your
        attention.
      </p>
    </div>
  );
}
