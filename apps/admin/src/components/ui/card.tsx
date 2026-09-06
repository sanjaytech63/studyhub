import * as React from 'react';
import { cn } from './button';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  readonly gradientBorder?: boolean;
}

export function Card({ className, gradientBorder = false, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'relative rounded-xl border border-border bg-card backdrop-blur-xl transition-all duration-200 overflow-hidden',
        // Top specular hairline highlight
        'before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-white/12 before:to-transparent',
        gradientBorder && 'border-primary/30 shadow-primary/5',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('flex flex-col space-y-1.5 p-5 border-b border-border/50', className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardTitle({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn('text-base font-semibold text-foreground tracking-tight', className)}
      {...props}
    >
      {children}
    </h3>
  );
}

export function CardDescription({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn('text-xs text-muted-foreground', className)} {...props}>
      {children}
    </p>
  );
}

export function CardContent({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('p-5', className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'flex items-center p-5 pt-0 border-t border-border/50 bg-secondary/20',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
