'use client';

import { REGEXP_ONLY_DIGITS } from 'input-otp';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';

interface OtpInputProps {
  readonly value: string;
  readonly onChange: (value: string) => void;
  readonly disabled?: boolean;
  readonly error?: string;
  readonly length?: number;
}

export function OtpInput({ value, onChange, disabled = false, error, length = 6 }: OtpInputProps) {
  return (
    <div className="flex flex-col items-center justify-center space-y-2.5 w-full">
      <InputOTP
        maxLength={length}
        value={value}
        onChange={onChange}
        disabled={disabled}
        pattern={REGEXP_ONLY_DIGITS}
        autoFocus
      >
        <InputOTPGroup className="gap-2 sm:gap-3 justify-center">
          {Array.from({ length }).map((_, index) => (
            <InputOTPSlot
              key={index}
              index={index}
              className={error ? 'border-destructive/80' : undefined}
            />
          ))}
        </InputOTPGroup>
      </InputOTP>

      {error ? <p className="text-center text-xs font-semibold text-destructive">{error}</p> : null}
    </div>
  );
}
