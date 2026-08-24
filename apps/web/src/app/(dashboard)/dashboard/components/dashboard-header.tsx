'use client';

import Link from 'next/link';
import { ArrowRight, BookOpen, Sparkles } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export function DashboardHeader() {
  return (
    <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="rounded-full text-xs font-medium">
            <Sparkles className="mr-1 size-3.5" />
            Learning dashboard
          </Badge>
        </div>

        <div>
          <h1
            id="dashboard-title"
            className="text-2xl font-semibold tracking-tight sm:text-3xl lg:text-4xl"
          >
            Welcome back, Sanjay.
          </h1>

          <p className="mt-1.5 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
            Continue learning, track your progress, and keep building momentum.
          </p>
        </div>
      </div>

      <Button className="w-full sm:w-auto">
        <Link href="/learning" className="flex gap-2 items-center">
          <BookOpen className="size-4" />
          Explore learning
          <ArrowRight className="size-4" />
        </Link>
      </Button>
    </div>
  );
}
