interface LegalHeaderProps {
  readonly title: string;
  readonly description: string;
  readonly lastUpdated: string;
}

export function LegalHeader({ title, description, lastUpdated }: LegalHeaderProps) {
  return (
    <header className="border-b border-border/70 bg-muted/30">
      <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-medium text-primary">StudyHub Legal</p>

          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
            {title}
          </h1>

          <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">{description}</p>

          <p className="mt-5 text-xs text-muted-foreground">Last updated: {lastUpdated}</p>
        </div>
      </div>
    </header>
  );
}
