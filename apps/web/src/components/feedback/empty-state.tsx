'use client';

import { useId, type ReactNode } from 'react';
import { Inbox } from 'lucide-react';

import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface EmptyStateProps {
  readonly title?: string;
  readonly message?: string;
  readonly actionLabel?: string;
  readonly onAction?: () => void;
  readonly actionHref?: string;
  readonly icon?: ReactNode;
  readonly className?: string;
}

export function EmptyState({
  title = 'No data found',
  message = 'There is nothing to display here yet.',
  actionLabel = 'Create new',
  onAction,
  actionHref,
  icon,
  className,
}: EmptyStateProps) {
  const titleId = useId();

  const showAction = Boolean(onAction) || Boolean(actionHref);

  return (
    <section
      aria-labelledby={titleId}
      className={[
        'rounded-xl border border-dashed border-border bg-card/50 p-8 text-center',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div
        aria-hidden="true"
        className="mx-auto flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary"
      >
        {icon ?? <Inbox className="size-5" />}
      </div>

      <h2 id={titleId} className="mt-4 text-sm font-semibold text-foreground">
        {title}
      </h2>

      <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">{message}</p>

      {showAction ? (
        actionHref ? (
          <Button size="sm" className="mt-5">
            <Link href={actionHref}>{actionLabel}</Link>
          </Button>
        ) : (
          <Button type="button" size="sm" onClick={onAction} className="mt-5">
            {actionLabel}
          </Button>
        )
      ) : null}
    </section>
  );
}
