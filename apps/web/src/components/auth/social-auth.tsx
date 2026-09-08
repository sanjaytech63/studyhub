import { Button } from '@/components/ui/button';
import { FaApple, FaGoogle } from 'react-icons/fa6';

export function SocialAuth() {
  return (
    <div className="space-y-3 pt-1">
      {/* Divider */}
      <div className="relative flex items-center justify-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border/60" />
        </div>
        <span className="relative bg-card px-2.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          Or continue with
        </span>
      </div>

      {/* Social login: column on mobile (< sm), row on iPad and laptop (sm and up) */}
      <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full">
        <Button
          type="button"
          variant="outline"
          className="w-full sm:flex-1 h-10 text-xs font-semibold gap-2 border-border/80 hover:bg-accent/60 transition-colors"
          disabled
        >
          <FaGoogle className="size-4 shrink-0 text-red-500" />
          <span className="sm:hidden">Continue with Google</span>
          <span className="hidden sm:inline">Google</span>
        </Button>

        <Button
          type="button"
          variant="outline"
          className="w-full sm:flex-1 h-10 text-xs font-semibold gap-2 border-border/80 hover:bg-accent/60 transition-colors"
          disabled
        >
          <FaApple className="size-4 shrink-0" />
          <span className="sm:hidden">Continue with Apple</span>
          <span className="hidden sm:inline">Apple</span>
        </Button>
      </div>

      <p className="text-center text-[11px] text-muted-foreground">
        Social login will be available soon.
      </p>
    </div>
  );
}
