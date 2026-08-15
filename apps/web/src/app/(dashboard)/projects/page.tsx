export default function ProjectsPage() {
  return (
    <section aria-labelledby="projects-title" className="space-y-6">
      <div>
        <h1 id="projects-title" className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Projects
        </h1>

        <p className="mt-1.5 text-sm text-muted-foreground sm:text-base">
          Build, manage, and track your learning projects.
        </p>
      </div>

      <div className="rounded-xl border border-dashed border-border bg-card p-8 text-center">
        <h2 className="text-sm font-semibold">No projects yet</h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Your projects will appear here once you create them.
        </p>
      </div>
    </section>
  );
}
