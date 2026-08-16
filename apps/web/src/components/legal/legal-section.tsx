import type { ReactNode } from 'react';

interface LegalSectionProps {
  readonly id?: string;
  readonly title: string;
  readonly children: ReactNode;
}

export function LegalSection({ id, title, children }: LegalSectionProps) {
  return (
    <section id={id} className="scroll-mt-24 space-y-3">
      <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">{title}</h2>

      <div className="space-y-4 text-sm leading-7 text-muted-foreground sm:text-base">
        {children}
      </div>
    </section>
  );
}
