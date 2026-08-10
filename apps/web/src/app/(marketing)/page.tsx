import { Button } from '@/components/ui/button';
import { MarketingContainer } from '@/components/marketing/shared/marketing-container';

export default function MarketingHomePage() {
  return (
    <section className="py-20 sm:py-28">
      <MarketingContainer>
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex rounded-full bg-accent px-3 py-1 text-sm font-medium text-accent-foreground">
            Learn smarter with StudyHub
          </span>

          <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-6xl">
            Build your skills.
            <span className="text-primary"> Build your future.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
            Learn modern technologies through structured courses, practical projects, and real-world
            development workflows.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button size="lg">Explore Courses</Button>

            <Button size="lg" variant="outline">
              View Pricing
            </Button>
          </div>
        </div>
      </MarketingContainer>
    </section>
  );
}
