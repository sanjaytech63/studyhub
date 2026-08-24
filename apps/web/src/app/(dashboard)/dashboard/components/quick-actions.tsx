import Link from 'next/link';
import { BookOpen, FolderKanban, Settings } from 'lucide-react';

import { Card, CardContent, CardHeader } from '@/components/ui/card';

const ACTIONS = [
  {
    href: '/learning',
    label: 'Browse courses',
    description: 'Find something new to learn.',
    icon: BookOpen,
  },
  {
    href: '/projects',
    label: 'Your projects',
    description: 'Build and manage your work.',
    icon: FolderKanban,
  },
  {
    href: '/settings',
    label: 'Settings',
    description: 'Manage your preferences.',
    icon: Settings,
  },
] as const;

export function QuickActions() {
  return (
    <Card className="border-border/60 shadow-sm">
      <CardHeader className="px-5 pb-3 pt-5">
        <h2 className="text-sm font-semibold">Quick actions</h2>

        <p className="text-xs text-muted-foreground">Common things you may want to do.</p>
      </CardHeader>

      <CardContent className="space-y-1.5 px-3 pb-3">
        {ACTIONS.map((action) => {
          const Icon = action.icon;

          return (
            <Link
              key={action.href}
              href={action.href}
              className={[
                'group flex items-center gap-3 rounded-xl px-2.5 py-2.5',
                'transition-colors',
                'hover:bg-muted/60',
                'focus-visible:outline-none',
                'focus-visible:ring-2',
                'focus-visible:ring-primary/40',
              ].join(' ')}
            >
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-colors group-hover:bg-primary/10 group-hover:text-primary">
                <Icon className="size-4" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{action.label}</p>

                <p className="truncate text-xs text-muted-foreground">{action.description}</p>
              </div>
            </Link>
          );
        })}
      </CardContent>
    </Card>
  );
}
