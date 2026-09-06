import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from './button';

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium tracking-wide uppercase font-mono transition-colors border',
  {
    variants: {
      variant: {
        active:
          'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-xs shadow-emerald-950/20',
        suspended:
          'bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-xs shadow-amber-950/20',
        inactive: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
        deleted: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
        system: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
        custom: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
        outline: 'bg-transparent text-muted-foreground border-border',
        neutral: 'bg-secondary text-secondary-foreground border-border',
      },
      size: {
        sm: 'text-[10px] px-2 py-0.2',
        md: 'text-xs px-2.5 py-0.5',
      },
    },
    defaultVariants: {
      variant: 'neutral',
      size: 'md',
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {
  readonly withDot?: boolean;
}

export function Badge({
  className,
  variant = 'neutral',
  size,
  withDot = true,
  children,
  ...props
}: BadgeProps) {
  const dotColorClass =
    variant === 'active'
      ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]'
      : variant === 'suspended'
        ? 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]'
        : variant === 'deleted'
          ? 'bg-rose-400 shadow-[0_0_8px_rgba(248,113,113,0.8)]'
          : variant === 'system'
            ? 'bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.8)]'
            : variant === 'custom'
              ? 'bg-purple-400 shadow-[0_0_8px_rgba(192,132,252,0.8)]'
              : 'bg-slate-400';

  return (
    <span className={cn(badgeVariants({ variant, size, className }))} {...props}>
      {withDot && (
        <span className="relative flex h-1.5 w-1.5 items-center justify-center">
          {variant === 'active' && (
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          )}
          <span className={cn('relative inline-flex h-1.5 w-1.5 rounded-full', dotColorClass)} />
        </span>
      )}
      <span>{children}</span>
    </span>
  );
}
