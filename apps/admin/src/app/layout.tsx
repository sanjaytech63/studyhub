import type { Metadata } from 'next';
import { Toaster } from 'sonner';
import './globals.css';
import { Providers } from '@/components/providers';
import { ThemeProvider } from '@/components/theme/theme-provider';

export const metadata: Metadata = {
  title: {
    default: 'StudyHub Admin',
    template: '%s | StudyHub Admin',
  },
  description: 'StudyHub administration panel — manage users, roles, and permissions.',
  robots: { index: false, follow: false },
};

interface RootLayoutProps {
  readonly children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <Providers>{children}</Providers>
        </ThemeProvider>
        <Toaster
          position="bottom-right"
          richColors
          toastOptions={{
            style: {
              background: 'var(--card)',
              border: '1px solid var(--border)',
              color: 'var(--foreground)',
            },
          }}
        />
      </body>
    </html>
  );
}
