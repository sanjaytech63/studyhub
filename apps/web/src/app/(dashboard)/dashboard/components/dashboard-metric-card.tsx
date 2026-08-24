import type { LucideIcon } from 'lucide-react';
import { ArrowUpRight } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

interface DashboardMetricCardProps {
  readonly label: string;
  readonly value: string | number;
  readonly description?: string;
  readonly icon: LucideIcon;
  readonly highlight?: boolean;
}

export function DashboardMetricCard({
  label,
  value,
  description,
  icon: Icon,
  highlight = false,
}: DashboardMetricCardProps) {
  return (
    <Card
      className={[
        'group relative overflow-hidden',
        'border-border/60',
        'bg-card/80',
        'shadow-sm',
        'transition-all duration-200',
        'hover:-translate-y-0.5',
        'hover:border-primary/20',
        'hover:shadow-md',
      ].join(' ')}
    >
      {highlight && (
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary to-transparent"
        />
      )}

      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div
            className={[
              'flex size-10 shrink-0 items-center justify-center rounded-xl',
              highlight ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground',
            ].join(' ')}
          >
            <Icon aria-hidden="true" className="size-5" />
          </div>

          <Badge
            variant="outline"
            className="rounded-full border-border/60 text-[11px] font-medium"
          >
            <ArrowUpRight aria-hidden="true" className="mr-1 size-3" />
            Active
          </Badge>
        </div>

        <div className="mt-5">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {label}
          </p>

          <p className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">{value}</p>

          {description && <p className="mt-1 text-xs text-muted-foreground">{description}</p>}
        </div>
      </CardContent>
    </Card>
  );
}
