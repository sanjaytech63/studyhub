import React from 'react';
import { Terminal } from 'lucide-react';

interface TechStackProps {
  readonly technologies?: Array<{
    readonly technology: {
      readonly name: string;
      readonly category: string;
      readonly iconUrl?: string | null;
    };
  }>;
}

const DEFAULT_TECH_STACK = [
  {
    category: 'Frontend',
    items: ['React 19', 'Next.js 15', 'Tailwind CSS', 'TanStack Query', 'Zustand'],
  },
  { category: 'Backend', items: ['Node.js', 'Express', 'TypeScript', 'Prisma ORM', 'Zod'] },
  { category: 'Database & Cache', items: ['PostgreSQL', 'MongoDB', 'Redis'] },
  { category: 'Infrastructure', items: ['Docker', 'Kubernetes', 'AWS', 'Nginx'] },
  { category: 'Testing', items: ['Vitest', 'Supertest', 'Playwright'] },
  { category: 'DevOps & CI/CD', items: ['GitHub Actions', 'ArgoCD', 'Pino Logging'] },
];

export function TechStackGrid({ technologies }: TechStackProps) {
  // Group technologies if provided from API
  const grouped = React.useMemo(() => {
    if (!technologies || technologies.length === 0) {
      return DEFAULT_TECH_STACK;
    }

    const map = new Map<string, string[]>();
    for (const t of technologies) {
      const cat = t.technology.category || 'General';
      if (!map.has(cat)) map.set(cat, []);
      map.get(cat)!.push(t.technology.name);
    }

    return Array.from(map.entries()).map(([category, items]) => ({ category, items }));
  }, [technologies]);

  return (
    <section aria-labelledby="tech-heading" className="space-y-6">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary uppercase tracking-wider">
          <Terminal className="h-4 w-4" />
          Production Stack
        </div>
        <h2
          id="tech-heading"
          className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground"
        >
          Technology Stack
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground">
          You will master modern, battle-tested technologies used by high-growth engineering teams.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {grouped.map((group) => (
          <div
            key={group.category}
            className="rounded-lg border border-border/80 bg-card p-5 shadow-xs space-y-3"
          >
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              {group.category}
            </h3>
            <div className="flex flex-wrap gap-2">
              {group.items.map((tech) => (
                <span
                  key={tech}
                  className="rounded-lg bg-muted/60 px-2.5 py-1 text-xs font-medium text-foreground border border-border/40 hover:border-primary/40 hover:bg-primary/5 transition-colors"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
