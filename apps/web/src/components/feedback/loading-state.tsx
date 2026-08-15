import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  readonly message?: string;
  readonly className?: string;
  readonly size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: {
    container: 'min-h-32',
    icon: 'size-4',
    text: 'text-xs',
  },
  md: {
    container: 'min-h-48',
    icon: 'size-5',
    text: 'text-sm',
  },
  lg: {
    container: 'min-h-64',
    icon: 'size-6',
    text: 'text-sm',
  },
} as const;

export function Loading({ message = 'Loading...', className, size = 'md' }: LoadingStateProps) {
  const styles = sizeClasses[size];

  return (
    <section
      role="status"
      aria-live="polite"
      aria-label={message}
      className={[
        'flex flex-col items-center justify-center rounded-xl border border-border/70 bg-card p-8 text-center',
        styles.container,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <Loader2
        aria-hidden="true"
        className={['animate-spin text-muted-foreground', styles.icon].join(' ')}
      />

      <p className={['mt-3 text-muted-foreground', styles.text].join(' ')}>{message}</p>
    </section>
  );
}
