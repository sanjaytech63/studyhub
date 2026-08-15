export default function LearningPage() {
  return (
    <section aria-labelledby="learning-title" className="space-y-6">
      <div>
        <h1 id="learning-title" className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Learning
        </h1>

        <p className="mt-1.5 text-sm text-muted-foreground sm:text-base">
          Continue your courses and explore new learning opportunities.
        </p>
      </div>

      <div className="rounded-xl border border-dashed border-border bg-card p-8 text-center">
        <h2 className="text-sm font-semibold">Your courses will appear here</h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Connect your learning API to display enrolled courses.
        </p>
      </div>
    </section>
  );
}
