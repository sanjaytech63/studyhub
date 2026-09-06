'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@teispace/next-themes';

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  function toggleTheme() {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={resolvedTheme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
      title={resolvedTheme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
      className={[
        'relative flex size-9 items-center justify-center',
        'rounded-lg bg-muted',
        'text-muted-foreground',
        'transition-colors',
        'hover:bg-muted/80 hover:text-foreground',
        'focus-visible:outline-none',
        'focus-visible:ring-2',
        'focus-visible:ring-primary/40',
        'focus-visible:ring-offset-2',
        'focus-visible:ring-offset-background',
      ].join(' ')}
    >
      <Sun
        aria-hidden="true"
        className={[
          'absolute size-4',
          'scale-100 rotate-0 opacity-100',
          'transition-all duration-200',
          'dark:scale-0',
          'dark:-rotate-90',
          'dark:opacity-0',
        ].join(' ')}
      />

      <Moon
        aria-hidden="true"
        className={[
          'absolute size-4',
          'scale-0 rotate-90 opacity-0',
          'transition-all duration-200',
          'dark:scale-100',
          'dark:rotate-0',
          'dark:opacity-100',
        ].join(' ')}
      />
    </button>
  );
}
