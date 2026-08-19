import type { ReactNode } from 'react';

import { LegalHeader } from './legal-header';
import { LegalNav } from './legal-nav';

interface LegalLayoutProps {
  readonly title: string;
  readonly description: string;
  readonly lastUpdated: string;
  readonly children: ReactNode;
}

export function LegalLayout({ title, description, lastUpdated, children }: LegalLayoutProps) {
  return (
    <main className="min-h-screen bg-background md:mt-5 mt-8">
      <LegalHeader title={title} description={description} lastUpdated={lastUpdated} />

      <div className="mx-auto flex w-full max-w-6xl gap-10 px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <LegalNav />

        <article className="min-w-0 flex-1">
          <div className="max-w-3xl space-y-10">{children}</div>
        </article>
      </div>
    </main>
  );
}
