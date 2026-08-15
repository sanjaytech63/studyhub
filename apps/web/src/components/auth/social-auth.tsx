import { Button } from '@/components/ui/button';
import { FaApple, FaGoogle } from 'react-icons/fa6';

export function SocialAuth() {
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap  items-center gap-3 justify-center">
        <Button type="button" variant="outline" className="md:w-fit w-full h-9!" disabled>
          <FaGoogle className="size-4" />
          Continue with Google
        </Button>

        <Button type="button" variant="outline" className="md:w-fit w-full h-9!" disabled>
          <FaApple className="size-4" />
          Continue with Apple
        </Button>
      </div>

      <p className="text-center text-xs text-muted-foreground">
        Social login will be available soon.
      </p>
    </div>
  );
}
