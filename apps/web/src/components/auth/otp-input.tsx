'use client';

import { useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';

interface OtpInputProps {
  readonly value: string;
  readonly onChange: (value: string) => void;
  readonly disabled?: boolean;
  readonly error?: string;
}

const OTP_LENGTH = 6;

export function OtpInput({ value, onChange, disabled = false, error }: OtpInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const nextValue = event.target.value.replace(/\D/g, '').slice(0, OTP_LENGTH);

    onChange(nextValue);
  }

  return (
    <div className="space-y-2">
      <Input
        ref={inputRef}
        value={value}
        onChange={handleChange}
        inputMode="numeric"
        autoComplete="one-time-code"
        maxLength={OTP_LENGTH}
        placeholder="000000"
        disabled={disabled}
        aria-label="6-digit verification code"
        aria-invalid={Boolean(error)}
        className="h-12 text-center text-lg font-semibold tracking-[0.45em]"
      />

      {error ? <p className="text-center text-xs text-destructive">{error}</p> : null}
    </div>
  );
}
