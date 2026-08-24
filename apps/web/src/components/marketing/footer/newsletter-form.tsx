'use client';

import { ArrowRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function NewsletterForm() {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // TODO:
    // Connect this to the newsletter API later.
    //
    // POST /api/v1/newsletter/subscriptions
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md">
      <div className="flex  gap-2 sm:flex-row">
        <Input
          type="email"
          name="email"
          placeholder="Enter your email"
          aria-label="Email address"
          autoComplete="email"
          required
          className="flex-1"
        />

        <Button type="submit" className="h-9  px-3">
          Subscribe
          <ArrowRight aria-hidden="true" className="size-4" />
        </Button>
      </div>

      <p className="mt-2 text-xs text-muted-foreground">No spam. Unsubscribe anytime.</p>
    </form>
  );
}
