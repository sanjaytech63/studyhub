interface DashboardHeaderProps {
  readonly title?: string;
  readonly description?: string;
}

export function DashboardHeader({
  title = 'Dashboard',
  description = "Welcome back. Here's what's happening with your learning.",
}: DashboardHeaderProps) {
  return (
    <header>
      <h1 id="dashboard-title" className="text-2xl font-semibold tracking-tight sm:text-3xl">
        {title}
      </h1>

      <p className="mt-1.5 text-sm text-muted-foreground sm:text-base">{description}</p>
    </header>
  );
}
