export default function SettingsPage() {
  return (
    <section aria-labelledby="settings-title" className="space-y-6">
      <div>
        <h1 id="settings-title" className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Settings
        </h1>

        <p className="mt-1.5 text-sm text-muted-foreground sm:text-base">
          Manage your account and application preferences.
        </p>
      </div>

      <div className="max-w-2xl space-y-4">
        <div className="rounded-xl border border-border/70 bg-card p-5 shadow-sm">
          <h2 className="text-sm font-semibold">Account settings</h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Account preferences will be available here.
          </p>
        </div>

        <div className="rounded-xl border border-border/70 bg-card p-5 shadow-sm">
          <h2 className="text-sm font-semibold">Notifications</h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Configure how StudyHub communicates with you.
          </p>
        </div>
      </div>
    </section>
  );
}
