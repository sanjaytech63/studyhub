import * as React from 'react';
import { Card } from './card';
import { cn } from './button';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export interface StatCardProps {
  readonly title: string;
  readonly value: string | number;
  readonly icon: React.ReactNode;
  readonly trend?: {
    readonly value: string | number;
    readonly label: string;
    readonly isPositive?: boolean;
    readonly isNeutral?: boolean;
  };
  readonly description?: string;
  readonly accentColor?: 'indigo' | 'emerald' | 'amber' | 'cyan' | 'purple';
  readonly className?: string;
}

export function StatCard({
  title,
  value,
  icon,
  trend,
  description,
  accentColor = 'indigo',
  className,
}: StatCardProps) {
  const accentClasses = {
    indigo: {
      border: 'hover:border-indigo-500/30',
      iconBg: 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-indigo-950/30',
      glow: 'from-indigo-500/10 to-transparent',
    },
    emerald: {
      border: 'hover:border-emerald-500/30',
      iconBg:
        'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-emerald-950/30',
      glow: 'from-emerald-500/10 to-transparent',
    },
    amber: {
      border: 'hover:border-amber-500/30',
      iconBg: 'bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-amber-950/30',
      glow: 'from-amber-500/10 to-transparent',
    },
    cyan: {
      border: 'hover:border-cyan-500/30',
      iconBg: 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-cyan-950/30',
      glow: 'from-cyan-500/10 to-transparent',
    },
    purple: {
      border: 'hover:border-purple-500/30',
      iconBg: 'bg-purple-500/10 text-purple-400 border border-purple-500/20 shadow-purple-950/30',
      glow: 'from-purple-500/10 to-transparent',
    },
  }[accentColor];

  return (
    <Card
      className={cn(
        'group relative p-5 transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5',
        accentClasses.border,
        className,
      )}
    >
      {/* Background ambient radial glow */}
      <div
        className={cn(
          'pointer-events-none absolute -top-12 -right-12 h-36 w-36 rounded-full bg-gradient-to-b opacity-25 blur-2xl transition-opacity group-hover:opacity-40',
          accentClasses.glow,
        )}
      />

      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {title}
          </p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-mono text-3xl font-semibold tracking-tight text-foreground tabular-nums">
              {value}
            </span>
          </div>
        </div>
        <div
          className={cn(
            'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl shadow-inner',
            accentClasses.iconBg,
          )}
        >
          {icon}
        </div>
      </div>

      {(trend || description) && (
        <div className="relative mt-4 flex items-center gap-2 pt-3 border-t border-border/40 text-xs">
          {trend && (
            <span
              className={cn(
                'inline-flex items-center gap-1 font-mono font-medium rounded-full px-2 py-0.5 text-[11px]',
                trend.isNeutral
                  ? 'bg-secondary text-muted-foreground'
                  : trend.isPositive
                    ? 'bg-emerald-500/10 text-emerald-400'
                    : 'bg-rose-500/10 text-rose-400',
              )}
            >
              {trend.isNeutral ? (
                <Minus className="h-3 w-3" />
              ) : trend.isPositive ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              {trend.value}
            </span>
          )}
          {description && <span className="text-muted-foreground truncate">{description}</span>}
        </div>
      )}
    </Card>
  );
}
