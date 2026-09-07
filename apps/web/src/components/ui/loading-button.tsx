'use client';

import * as React from 'react';
import { Loader2 } from 'lucide-react';
import { Button, type ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface LoadingButtonProps extends ButtonProps {
  readonly loading?: boolean;
  readonly loadingText?: string;
}

export const LoadingButton = React.forwardRef<HTMLButtonElement, LoadingButtonProps>(
  ({ loading = false, loadingText, children, disabled, className, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        {...props}
        disabled={disabled || loading}
        aria-busy={loading}
        className={cn('w-full', className)}
      >
        {loading ? (
          <>
            <Loader2 aria-hidden="true" className="size-4 animate-spin shrink-0" />
            <span>{loadingText ?? children}</span>
          </>
        ) : (
          children
        )}
      </Button>
    );
  },
);
LoadingButton.displayName = 'LoadingButton';
