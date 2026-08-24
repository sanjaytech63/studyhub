'use client';

import Link from 'next/link';
import { ArrowRight, Target, TrendingUp } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

export function DashboardProgress() {
  const progress = 68;

  return (
    <Card className="border-border/60 shadow-sm">
      <CardHeader className="flex flex-row items-center gap-3 px-5 pb-3 pt-5">
        <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Target className="size-4.5" />
        </div>

        <div className="min-w-0">
          <h2 className="text-sm font-semibold">Weekly goal</h2>

          <p className="text-xs text-muted-foreground">Stay consistent this week</p>
        </div>
      </CardHeader>

      <CardContent className="px-5 pb-5">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-3xl font-semibold tracking-tight">{progress}%</p>

            <p className="mt-1 text-xs text-muted-foreground">4.8 of 7 hours completed</p>
          </div>

          <Badge variant="secondary" className="rounded-full">
            <TrendingUp className="mr-1 size-3.5" />
            On track
          </Badge>
        </div>

        <Progress value={progress} className="mt-5 h-2" />

        <Button variant="ghost" size="sm" className="mt-3 w-full justify-between">
          <Link href="/learning">
            View learning progress
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
