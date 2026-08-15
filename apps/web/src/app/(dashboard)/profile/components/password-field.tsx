import { FormControl, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import type { ControllerRenderProps, FieldPath, FieldValues } from 'react-hook-form';

interface PasswordFieldProps<TFieldValues extends FieldValues> {
  readonly field: ControllerRenderProps<TFieldValues, FieldPath<TFieldValues>>;

  readonly label: string;
  readonly placeholder: string;
  readonly disabled: boolean;
  readonly autoComplete: 'current-password' | 'new-password';
}

export function PasswordField<TFieldValues extends FieldValues>({
  field,
  label,
  placeholder,
  disabled,
  autoComplete,
}: PasswordFieldProps<TFieldValues>) {
  const [visible, setVisible] = useState(false);

  return (
    <FormItem>
      <FormLabel>{label}</FormLabel>

      <FormControl>
        <div className="relative">
          <Input
            {...field}
            type={visible ? 'text' : 'password'}
            placeholder={placeholder}
            disabled={disabled}
            autoComplete={autoComplete}
            className="pr-10"
          />

          <button
            type="button"
            tabIndex={-1}
            aria-label={visible ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`}
            onClick={() => setVisible((current) => !current)}
            disabled={disabled}
            className={[
              'absolute right-0 top-0',
              'flex h-10 w-10 items-center justify-center',
              'text-muted-foreground',
              'transition-colors',
              'hover:text-foreground',
              'disabled:pointer-events-none',
              'disabled:opacity-50',
            ].join(' ')}
          >
            {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
      </FormControl>

      <FormMessage />
    </FormItem>
  );
}
