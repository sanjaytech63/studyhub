'use client';

import { useState, type InputHTMLAttributes } from 'react';
import { Eye, EyeOff, Lock, ShieldAlert } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface PasswordFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  readonly label: string;
  readonly error?: string;
  readonly labelClassName?: string;
}

export function PasswordField({
  id,
  label,
  error,
  className,
  labelClassName,
  ...props
}: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="space-y-1.5">
      <Label
        htmlFor={id}
        className={cn(
          'text-xs font-bold uppercase tracking-wider text-muted-foreground',
          labelClassName,
        )}
      >
        {label}
      </Label>

      <div className="relative">
        <Lock
          aria-hidden="true"
          className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/60 transition-colors peer-focus:text-primary"
        />
        <Input
          {...props}
          id={id}
          type={visible ? 'text' : 'password'}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          className={cn(
            'peer h-11 pl-10 pr-10 text-sm font-medium transition-all',
            error
              ? 'border-destructive focus-visible:ring-destructive/20'
              : 'focus-visible:ring-primary/20',
            className,
          )}
        />

        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          aria-label={visible ? 'Hide password' : 'Show password'}
          className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer rounded-md p-1 text-muted-foreground/60 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {visible ? (
            <EyeOff className="size-4" aria-hidden="true" />
          ) : (
            <Eye className="size-4" aria-hidden="true" />
          )}
        </button>
      </div>

      {error ? (
        <p
          id={`${id}-error`}
          className="inline-flex items-center gap-1 text-[11px] font-semibold text-destructive"
        >
          <ShieldAlert className="size-3 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </p>
      ) : null}
    </div>
  );
}
