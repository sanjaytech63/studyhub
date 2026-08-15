'use client';

import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { useId } from 'react';

import { cn } from '@/lib/utils';
import { createBreadcrumbs } from '@/lib/dashboard/dashboard.utils';

interface DashboardBreadcrumbsProps {
  readonly pathname: string;
}

export function DashboardBreadcrumbs({ pathname }: DashboardBreadcrumbsProps) {
  const navigationLabelId = useId();
  const breadcrumbs = createBreadcrumbs(pathname);

  if (breadcrumbs.length === 0) {
    return null;
  }

  return (
    <nav aria-labelledby={navigationLabelId} className="min-w-0">
      <span id={navigationLabelId} className="sr-only">
        Breadcrumb
      </span>

      <ol className="flex min-w-0 items-center gap-1.5">
        {breadcrumbs.map((item, index) => {
          const isFirst = index === 0;
          const isLast = index === breadcrumbs.length - 1;

          return (
            <li
              key={`${item.href ?? item.label}-${index}`}
              className="flex min-w-0 items-center gap-1.5"
            >
              {isFirst ? (
                <Home
                  aria-hidden="true"
                  className="hidden size-4 shrink-0 text-muted-foreground sm:block"
                />
              ) : null}

              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className={cn(
                    'hidden max-w-40 truncate text-sm',
                    'text-muted-foreground',
                    'transition-colors hover:text-foreground',
                    'focus-visible:outline-none',
                    'focus-visible:ring-2',
                    'focus-visible:ring-primary/40',
                    'focus-visible:ring-offset-2',
                    'sm:block',
                  )}
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  aria-current={isLast ? 'page' : undefined}
                  className={cn(
                    'min-w-0 truncate text-sm',
                    isLast ? 'font-semibold text-foreground' : 'text-muted-foreground',
                  )}
                >
                  {item.label}
                </span>
              )}

              {!isLast ? (
                <ChevronRight
                  aria-hidden="true"
                  className="size-3.5 shrink-0 text-muted-foreground/60"
                />
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
