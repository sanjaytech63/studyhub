import { AlertCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';

interface ErrorStateProps {
  readonly title?: string;
  readonly message?: string;
  readonly actionLabel?: string;
  readonly onRetry?: () => void;
}

export function ErrorState({
  title = 'Something went wrong',
  message = 'We were unable to complete your request. Please try again.',
  actionLabel = 'Try again',
  onRetry,
}: ErrorStateProps) {
  return (
    <section
      role="alert"
      aria-labelledby="error-state-title"
      className="rounded-xl border border-destructive/20 bg-card p-6"
    >
      <div className="flex gap-4">
        <div
          className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-destructive/10"
          aria-hidden="true"
        >
          <AlertCircle className="size-5 text-destructive" />
        </div>

        <div className="min-w-0">
          <h2 id="error-state-title" className="text-sm font-semibold">
            {title}
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">{message}</p>

          {onRetry ? (
            <Button type="button" variant="outline" size="sm" onClick={onRetry} className="mt-4">
              {actionLabel}
            </Button>
          ) : null}
        </div>
      </div>
    </section>
  );
}
