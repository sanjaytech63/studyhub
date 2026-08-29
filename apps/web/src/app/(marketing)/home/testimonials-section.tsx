import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  CheckCircle2,
  GraduationCap,
  MessageSquareQuote,
  Quote,
  Sparkles,
  Star,
  ThumbsUp,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

import { testimonials } from './data/testimonials';

/* ==========================================================================
   TYPES
========================================================================== */

type Testimonial = (typeof testimonials)[number];

/* ==========================================================================
   CONSTANTS
========================================================================== */

const MAX_TESTIMONIALS = 3;

/* ==========================================================================
   SECTION
========================================================================== */

export function TestimonialsSection() {
  const visibleTestimonials = testimonials.slice(0, MAX_TESTIMONIALS);

  return (
    <section
      aria-labelledby="testimonials-heading"
      className="relative overflow-hidden bg-background pb-16 sm:pb-20 lg:pb-28"
    >
      {/* Radial Ambient Lighting Background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-150 w-full max-w-7xl -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent blur-3xl"
      />

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <TestimonialsHeader />

        <SocialProofBar />

        {visibleTestimonials.length > 0 ? (
          <div className="mt-8 grid gap-6 md:grid-cols-3 lg:mt-12 lg:gap-8">
            {visibleTestimonials.map((testimonial, idx) => (
              <TestimonialCard
                key={testimonial.id}
                testimonial={testimonial}
                featured={idx === 1}
              />
            ))}
          </div>
        ) : (
          <TestimonialsEmptyState />
        )}
      </div>
    </section>
  );
}

/* ==========================================================================
   HEADER
========================================================================== */

function TestimonialsHeader() {
  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
      <div className="max-w-2xl">
        <Badge
          variant="outline"
          className="inline-flex items-center gap-2 rounded-full border-primary/20 bg-primary/5 px-3.5 py-1 text-xs font-semibold text-primary backdrop-blur-sm"
        >
          <MessageSquareQuote aria-hidden="true" className="size-3.5" />
          <span>Learner Proof</span>
        </Badge>

        <h2
          id="testimonials-heading"
          className="mt-4 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl lg:leading-[1.1]"
        >
          Loved by learners,{' '}
          <span className="bg-linear-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
            proven by careers.
          </span>
        </h2>

        <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          Discover how real students transformed their skill set and landed their dream roles
          through StudyHub.
        </p>
      </div>

      <Button
        variant="outline"
        size="lg"
        className="group min-h-11 rounded-xl border-border/80 bg-card/60 px-5 shadow-xs backdrop-blur-md transition-all duration-300 hover:border-primary/30 hover:bg-card hover:shadow-md"
      >
        <Link href="/reviews" className="inline-flex items-center gap-2 font-semibold">
          <span>Read All 12,000+ Reviews</span>
          <ArrowRight
            aria-hidden="true"
            className="size-4 transition-transform duration-200 group-hover:translate-x-1"
          />
        </Link>
      </Button>
    </div>
  );
}

/* ==========================================================================
   SOCIAL PROOF METRICS BAR
========================================================================== */

function SocialProofBar() {
  return (
    <div className="mt-8 flex flex-wrap items-center gap-6 rounded-2xl border border-border/60 bg-card/40 p-4 backdrop-blur-md sm:gap-8 sm:px-6">
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className="size-4 fill-amber-400 text-amber-400" />
          ))}
        </div>
        <span className="text-sm font-extrabold text-foreground">4.9 / 5.0</span>
        <span className="text-xs text-muted-foreground">(Overall Rating)</span>
      </div>

      <Separator orientation="vertical" className="hidden h-5 bg-border/60 sm:block" />

      <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
        <ThumbsUp className="size-3.5 text-primary" />
        <span>
          <strong className="text-foreground">98%</strong> completion satisfaction
        </span>
      </div>

      <Separator orientation="vertical" className="hidden h-5 bg-border/60 sm:block" />

      <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
        <GraduationCap className="size-3.5 text-primary" />
        <span>
          <strong className="text-foreground">120,000+</strong> active graduates
        </span>
      </div>
    </div>
  );
}

/* ==========================================================================
   TESTIMONIAL CARD
========================================================================== */

interface TestimonialCardProps {
  testimonial: Testimonial;
  featured?: boolean;
}

function TestimonialCard({ testimonial, featured = false }: TestimonialCardProps) {
  return (
    <Card
      className={`group relative flex h-full flex-col overflow-hidden rounded-2xl border p-6 shadow-xl backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl sm:p-7 ${
        featured
          ? 'border-primary/40 bg-card/90 shadow-primary/5'
          : 'border-border/60 bg-card/60 hover:border-primary/30'
      }`}
    >
      {/* Decorative Gradient Line for Featured Card */}
      {featured && (
        <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-transparent via-primary to-transparent" />
      )}

      {/* Card Top: Rating & Quote Graphic */}
      <div className="flex items-center justify-between gap-4">
        <TestimonialRating rating={testimonial.rating} />
        <Quote className="size-8 text-primary/20 transition-colors group-hover:text-primary/40" />
      </div>

      {/* Quote Body */}
      <blockquote className="relative mt-5 flex-1">
        <p className="text-base leading-relaxed text-foreground/90 font-medium sm:text-lg sm:leading-relaxed">
          “{testimonial.quote}”
        </p>
      </blockquote>

      {/* Associated Course Badge */}
      <TestimonialCourse slug={testimonial.course.slug} title={testimonial.course.title} />

      <Separator className="my-5 bg-border/60" />

      {/* Author Metadata */}
      <TestimonialAuthor
        avatar={testimonial.user.avatar}
        name={testimonial.user.name}
        role={testimonial.user.role}
      />
    </Card>
  );
}

/* ==========================================================================
   RATING
========================================================================== */

interface TestimonialRatingProps {
  rating: number;
}

function TestimonialRating({ rating }: TestimonialRatingProps) {
  const normalizedRating = Math.max(0, Math.min(5, rating));

  return (
    <div aria-label={`${normalizedRating} out of 5 stars`} className="flex items-center gap-1">
      {Array.from({ length: 5 }, (_, index) => (
        <Star
          key={index}
          aria-hidden="true"
          className={`size-4 ${
            index < normalizedRating ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/20'
          }`}
        />
      ))}
    </div>
  );
}

/* ==========================================================================
   COURSE CONTEXT
========================================================================== */

interface TestimonialCourseProps {
  slug: string;
  title: string;
}

function TestimonialCourse({ slug, title }: TestimonialCourseProps) {
  return (
    <div className="mt-6">
      <p className="text-[10px] font-extrabold uppercase tracking-widest text-primary">
        Completed Track
      </p>

      <Link
        href={`/courses/${encodeURIComponent(slug)}`}
        className="group/link mt-1.5 inline-flex items-center gap-1.5 text-xs font-bold text-foreground transition-colors hover:text-primary"
      >
        <span className="truncate">{title}</span>
        <ArrowRight
          aria-hidden="true"
          className="size-3 text-muted-foreground transition-transform group-hover/link:translate-x-0.5 group-hover/link:text-primary"
        />
      </Link>
    </div>
  );
}

/* ==========================================================================
   AUTHOR
========================================================================== */

interface TestimonialAuthorProps {
  avatar: string;
  name: string;
  role: string;
}

function TestimonialAuthor({ avatar, name, role }: TestimonialAuthorProps) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-3.5 min-w-0">
        <TestimonialAvatar src={avatar} name={name} />

        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-foreground">{name}</p>

          <p className="truncate text-xs font-medium text-muted-foreground">{role}</p>
        </div>
      </div>

      <Badge
        variant="secondary"
        className="shrink-0 gap-1 rounded-full border-emerald-500/20 bg-emerald-500/10 text-[10px] font-bold text-emerald-600 dark:text-emerald-400"
      >
        <CheckCircle2 className="size-3 stroke-[2.5]" />
        Verified
      </Badge>
    </div>
  );
}

/* ==========================================================================
   AVATAR
========================================================================== */

interface TestimonialAvatarProps {
  src: string;
  name: string;
}

function TestimonialAvatar({ src, name }: TestimonialAvatarProps) {
  return (
    <div className="relative size-10 shrink-0 overflow-hidden rounded-full border border-primary/20 bg-muted shadow-xs">
      <Image src={src} alt="" width={40} height={40} className="size-full object-cover" />

      <span className="sr-only">Profile photo of {name}</span>
    </div>
  );
}

/* ==========================================================================
   EMPTY STATE
========================================================================== */

function TestimonialsEmptyState() {
  return (
    <Card className="mt-8 rounded-2xl border-dashed border-border/80 bg-card/40 p-12 text-center shadow-none backdrop-blur-sm lg:mt-10">
      <div className="mx-auto max-w-md">
        <div className="mx-auto flex size-12 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">
          <Sparkles aria-hidden="true" className="size-6" />
        </div>

        <h3 className="mt-4 text-lg font-bold text-foreground">Learner reviews coming soon</h3>

        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          We are currently aggregating real graduate stories and verified platform ratings.
        </p>

        <Button
          variant="outline"
          className="mt-6 rounded-xl border-border/80 bg-background/50 hover:bg-card"
        >
          <Link href="/courses" className="inline-flex items-center gap-2 font-semibold">
            <span>Explore Courses</span>
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </Button>
      </div>
    </Card>
  );
}
