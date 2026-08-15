'use client';

import type { ReactNode } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ButtonProps } from '@base-ui/react';

interface LoadingButtonProps extends ButtonProps {
  readonly loading?: boolean;
  readonly loadingText?: string;
  readonly children: ReactNode;
}

export function LoadingButton({
  loading = false,
  loadingText,
  children,
  disabled,
  ...props
}: LoadingButtonProps) {
  return (
    <Button
      {...props}
      type={props.type ?? 'button'}
      disabled={disabled || loading}
      aria-busy={loading}
      className="h-9! w-full"
    >
      {loading ? (
        <>
          <Loader2 aria-hidden="true" strokeWidth={4} className="size-4 animate-spin" />
          <span>{loadingText ?? children}</span>
        </>
      ) : (
        children
      )}
    </Button>
  );
}
