import Link from 'next/link';
import { ArrowRight, BookOpen, CheckCircle2, Clock3 } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const ACTIVITIES = [
  {
    id: '1',
    title: 'Completed JavaScript Fundamentals',
    description: 'Course milestone completed',
    time: '2 hours ago',
    icon: CheckCircle2,
    type: 'Completed',
  },
  {
    id: '2',
    title: 'Continued React Architecture',
    description: 'Completed lesson 12',
    time: 'Yesterday',
    icon: BookOpen,
    type: 'Learning',
  },
  {
    id: '3',
    title: 'Learning session',
    description: '45 minutes of focused learning',
    time: 'Yesterday',
    icon: Clock3,
    type: 'Activity',
  },
] as const;

export function RecentActivity() {
  return (
    <Card className="border-border/60 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between gap-4 px-5 py-5 sm:px-6">
        <div>
          <h2 className="text-base font-semibold tracking-tight">Recent activity</h2>

          <p className="mt-1 text-sm text-muted-foreground">Your latest learning activity.</p>
        </div>

        <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
          <Link href="/notifications">
            View all
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </CardHeader>

      <Separator />

      <CardContent className="p-0">
        <div className="divide-y divide-border/60">
          {ACTIVITIES.map((activity) => {
            const Icon = activity.icon;

            return (
              <div key={activity.id} className="flex items-center gap-4 px-5 py-4 sm:px-6">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                  <Icon className="size-4.5" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{activity.title}</p>

                  <p className="mt-0.5 truncate text-xs text-muted-foreground">
                    {activity.description}
                  </p>
                </div>

                <div className="hidden shrink-0 text-right sm:block">
                  <Badge variant="secondary" className="rounded-full text-[10px]">
                    {activity.type}
                  </Badge>

                  <p className="mt-1 text-[11px] text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            );
          })}
        </div>

        <Button variant="ghost" size="sm" className="m-3 w-[calc(100%-1.5rem)] sm:hidden">
          <Link href="/notifications">
            View all activity
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
