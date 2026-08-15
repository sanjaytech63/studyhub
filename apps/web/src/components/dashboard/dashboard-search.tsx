'use client';

import { Search } from 'lucide-react';
import { Input } from '../ui/input';

export function DashboardSearch() {
  return (
    <div className="relative hidden w-64 lg:block xl:w-72">
      <Search
        aria-hidden="true"
        className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
      />

      <Input
        type="search"
        name="dashboard-search"
        placeholder="Search..."
        aria-label="Search dashboard"
        className="pl-9 h-9! pr-3"
      />
    </div>
  );
}
