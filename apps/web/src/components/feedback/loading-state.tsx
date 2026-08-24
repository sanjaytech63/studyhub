interface LoadingStateProps {
  readonly message?: string;
  readonly className?: string;
  readonly size?: 'sm' | 'md' | 'lg';
}

export function Loading({ message = 'Loading...' }: LoadingStateProps) {
  return (
    <div className="flex min-h-100 items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-3">
        <div
          aria-hidden="true"
          className={[
            'size-7 animate-spin rounded-full',
            'border-2 border-muted',
            'border-t-primary',
          ].join(' ')}
        />

        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
    </div>
  );
}
