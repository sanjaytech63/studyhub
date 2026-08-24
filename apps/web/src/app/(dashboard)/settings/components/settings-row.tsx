import type { ReactNode } from 'react';
import { Separator } from '@/components/ui/separator';

interface SettingsRowProps {
  readonly icon: ReactNode;
  readonly title: string;
  readonly description: string;
  readonly children: ReactNode;
  readonly last?: boolean;
}

export function SettingsRow({
  icon,
  title,
  description,
  children,
  last = false,
}: SettingsRowProps) {
  return (
    <>
      <div className="flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:px-6">
        <div className="flex min-w-0 flex-1 items-start gap-3">
          <div
            aria-hidden="true"
            className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary"
          >
            {icon}
          </div>

          <div className="min-w-0">
            <p className="text-sm font-medium text-foreground">{title}</p>
            <p className="mt-1 max-w-xl text-sm leading-5 text-muted-foreground">{description}</p>
          </div>
        </div>
        <div className="shrink-0 sm:ml-auto">{children}</div>
      </div>
      {!last && <Separator />}
    </>
  );
}
