'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className={[
        'relative inline-flex size-9 items-center justify-center',
        'rounded-full',
        'border border-border',
        'bg-background',
        'text-muted-foreground',
        'backdrop-blur-xl',
        'transition-all duration-200',
        'hover:bg-accent',
        'hover:text-foreground',
        'active:scale-95',
      ].join(' ')}
    >
      {/* Sun */}
      <Sun
        aria-hidden="true"
        className={[
          'absolute size-4',
          'scale-100 rotate-0 opacity-100',
          'transition-all duration-200',
          'dark:scale-0 dark:-rotate-90 dark:opacity-0',
        ].join(' ')}
      />

      {/* Moon */}
      <Moon
        aria-hidden="true"
        className={[
          'absolute size-4',
          'scale-0 rotate-90 opacity-0',
          'transition-all duration-200',
          'dark:scale-100 dark:rotate-0 dark:opacity-100',
        ].join(' ')}
      />
    </button>
  );
}
