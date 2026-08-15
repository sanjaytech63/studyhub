import { Button } from '@/components/ui/button';

interface ProfileErrorProps {
  readonly message: string;
  readonly onRetry: () => void;
}

export function ProfileError({ message, onRetry }: ProfileErrorProps) {
  return (
    <section aria-labelledby="profile-error-title" className="space-y-6">
      <div>
        <h1 id="profile-error-title" className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Profile
        </h1>

        <p className="mt-1.5 text-sm text-muted-foreground">Manage your personal information.</p>
      </div>

      <div className="max-w-3xl rounded-xl border border-destructive/20 bg-card p-6">
        <h2 className="text-sm font-semibold">Unable to load profile</h2>

        <p className="mt-1 text-sm text-muted-foreground">
          {message || 'Something went wrong while loading your profile.'}
        </p>

        <Button type="button" variant="outline" size="sm" onClick={onRetry} className="mt-4">
          Try again
        </Button>
      </div>
    </section>
  );
}
