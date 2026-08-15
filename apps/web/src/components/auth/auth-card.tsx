import type { ReactNode } from 'react';

interface AuthCardProps {
  readonly title: string;
  readonly description: string;
  readonly children: ReactNode;
  readonly footer?: ReactNode;
}

export function AuthCard({ title, description, children, footer }: AuthCardProps) {
  return (
    <div className="rounded-2xl border border-border/70 bg-card p-6 shadow-sm">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
      </div>
      {children}
      {footer ? <div className="mt-6 border-t border-border/60 pt-5">{footer}</div> : null}
    </div>
  );
}
