import * as React from 'react';
import { cn } from './button';

export type SkeletonProps = React.HTMLAttributes<HTMLDivElement>;

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      data-slot="skeleton"
      className={cn('animate-pulse rounded-lg bg-muted', className)}
      {...props}
    />
  );
}
