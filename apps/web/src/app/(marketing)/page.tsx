import { CategoriesSection } from './home/categories-section';
import { FeaturedCoursesSection } from './home/featured-courses-section';
import { FinalCtaSection } from './home/final-cta-section';
import { HeroSection } from './home/hero-section';
import { InstructorSection } from './home/instructor-section';
import { LearningExperienceSection } from './home/learning-experience-section';
import { LearningJourneySection } from './home/learning-journey-section';
import { TestimonialsSection } from './home/testimonials-section';
import { TrustStrip } from './home/trust-strip';
import { WhyStudyHubSection } from './home/why-studyhub-section';

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <TrustStrip />
      <CategoriesSection />
      <FeaturedCoursesSection />
      <WhyStudyHubSection />
      <LearningJourneySection />
      <LearningExperienceSection />
      <InstructorSection />
      <TestimonialsSection />
      <FinalCtaSection />
    </main>
  );
}
