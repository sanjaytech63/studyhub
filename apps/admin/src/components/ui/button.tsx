'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader } from 'lucide-react';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 font-medium transition-all duration-150 rounded-lg text-sm select-none cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] whitespace-nowrap',
  {
    variants: {
      variant: {
        primary:
          'bg-gradient-to-r from-primary to-primary-hover text-white shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 hover:brightness-110 border border-primary/40',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-muted border border-border/80 shadow-xs hover:border-border',
        outline:
          'border border-border bg-transparent hover:bg-secondary/70 text-foreground hover:border-border-hover',
        ghost: 'hover:bg-muted/70 text-muted-foreground hover:text-foreground',
        destructive:
          'bg-destructive/15 text-destructive border border-destructive/30 hover:bg-destructive/25 hover:border-destructive/50',
        destructiveSolid:
          'bg-destructive text-white hover:bg-destructive/90 shadow-xs border border-destructive',
      },
      size: {
        sm: 'h-8 px-3 text-xs rounded-lg',
        md: 'h-10 px-4 py-2 text-sm rounded-lg',
        lg: 'h-10 px-6 text-base rounded-xl',
        icon: 'h-10 w-10 p-0 rounded-lg',
        iconSm: 'h-8 w-8 p-0 rounded-md',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  readonly isLoading?: boolean;
  readonly leftIcon?: React.ReactNode;
  readonly rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      >
        {isLoading && <Loader className="h-4 w-4 animate-spin text-current shrink-0" />}
        {!isLoading && leftIcon && (
          <span className="inline-flex items-center justify-center shrink-0">{leftIcon}</span>
        )}
        {children && <span className="inline-flex items-center">{children}</span>}
        {!isLoading && rightIcon && (
          <span className="inline-flex items-center justify-center shrink-0">{rightIcon}</span>
        )}
      </button>
    );
  },
);

Button.displayName = 'Button';
