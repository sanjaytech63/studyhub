import type { ReactNode } from 'react';

import { Footer } from '@/components/marketing/footer/footer';
import { Navbar } from '@/components/marketing/navbar/navbar';
import { MobileBottomNav } from '@/components/marketing/navbar/mobile-bottom-nav';
import { MobileMoreMenu } from '@/components/marketing/navbar/mobile-more-menu';
import { MobileNavigationProvider } from '@/components/marketing/navbar/mobile-navigation-provider';

interface MarketingLayoutProps {
  children: ReactNode;
}

export default function MarketingLayout({ children }: MarketingLayoutProps) {
  return (
    <MobileNavigationProvider>
      <div className="min-h-dvh bg-background">
        <Navbar />
        <main className="flex-1 pb-24 md:pb-0">{children}</main>
        <Footer />
        <MobileBottomNav />
        <MobileMoreMenu />
      </div>
    </MobileNavigationProvider>
  );
}
