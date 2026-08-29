import * as React from 'react';
import Link from 'next/link';
import { BookOpen, Sparkles } from 'lucide-react';

import { MarketingContainer } from '../shared/marketing-container';
import { navItems } from '../navbar/navigation';
import { NewsletterForm } from './newsletter-form';
import { companyLinks, legalLinks, resourceLinks, socialLinks } from './footer-navigation';

export function Footer() {
  const currentYear = new Date().getFullYear();
  const productLinks = navItems.filter((item) => item.href !== '/');

  return (
    <footer className="relative border-t border-border/50 bg-background mb-16 md:mb-0">
      <MarketingContainer>
        {/* =========================================================
            NEWSLETTER CTA CARD
            ========================================================= */}
        <div className="pt-10 md:pt-14">
          <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-linear-to-b from-muted/50 to-muted/20 p-8 sm:p-10 md:p-12">
            {/* Ambient Background Glow */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full bg-primary/10 blur-3xl"
            />

            <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
              {/* Content */}
              <div className="max-w-xl space-y-2">
                <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                  <Sparkles className="size-3.5" />
                  <span>Stay ahead of the curve</span>
                </div>

                <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                  Learn something new every week.
                </h2>

                <p className="text-sm leading-relaxed text-muted-foreground">
                  Get practical engineering insights, hands-on tutorials, and StudyHub platform
                  updates delivered straight to your inbox. No spam, ever.
                </p>
              </div>

              {/* Newsletter Component */}
              <div className="w-full max-w-md shrink-0">
                <NewsletterForm />
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================
            MAIN FOOTER LINKS
            ========================================================= */}
        <div className="grid gap-10 py-12 sm:grid-cols-2 md:py-16 lg:grid-cols-[1.5fr_repeat(4,1fr)] lg:gap-8">
          {/* Brand Info */}
          <div className="space-y-4 lg:pr-4">
            <Link
              href="/"
              aria-label="StudyHub Home"
              className="group flex items-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
            >
              <div className="flex size-9 items-center justify-center rounded-xl bg-primary shadow-sm shadow-primary/20 transition-transform group-hover:scale-105 active:scale-95">
                <BookOpen className="size-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold tracking-tight text-foreground transition-colors group-hover:text-primary">
                StudyHub
              </span>
            </Link>

            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              Empowering engineers to master real-world skills through interactive courses,
              projects, and structured learning paths.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-2 pt-2">
              {socialLinks?.map((social) => {
                const Icon = social.icon;

                return (
                  <Link
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="inline-flex size-9 items-center justify-center rounded-lg border border-border/80 bg-background text-muted-foreground transition-all hover:-translate-y-0.5 hover:border-border hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                  >
                    <Icon aria-hidden="true" className="size-4" />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Navigation Columns */}
          <FooterLinkGroup title="Product" links={productLinks} />
          <FooterLinkGroup title="Company" links={companyLinks} />
          <FooterLinkGroup title="Resources" links={resourceLinks} />
          <FooterLinkGroup title="Legal" links={legalLinks} />
        </div>

        {/* =========================================================
            BOTTOM UTILITIES BAR
            ========================================================= */}
        <div className="flex flex-col gap-4 border-t border-border/60 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-4">
            <p>© {currentYear} StudyHub Inc. All rights reserved.</p>

            {/* System Status Indicator */}
            <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-muted/40 px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
              <span className="relative flex size-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
              </span>
              <span>All systems operational</span>
            </div>
          </div>

          {/* Legal Quick Links */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 font-medium">
            <Link href="/privacy" className="transition-colors hover:text-foreground">
              Privacy Policy
            </Link>
            <Link href="/terms" className="transition-colors hover:text-foreground">
              Terms of Service
            </Link>
            <Link href="/cookies" className="transition-colors hover:text-foreground">
              Cookie Preferences
            </Link>
          </div>
        </div>
      </MarketingContainer>
    </footer>
  );
}

/* ===============================================================
   REUSABLE FOOTER LINK GROUP
   =============================================================== */

interface FooterLinkItem {
  label: string;
  href: string;
  badge?: string;
}

interface FooterLinkGroupProps {
  title: string;
  links: FooterLinkItem[];
}

function FooterLinkGroup({ title, links }: FooterLinkGroupProps) {
  return (
    <div className="space-y-3.5">
      <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">{title}</h3>

      <nav aria-label={`${title} navigation`} className="flex flex-col gap-2.5">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="group inline-flex items-center gap-2 text-sm text-muted-foreground transition-all hover:translate-x-0.5 hover:text-foreground"
          >
            <span>{link.label}</span>
            {link.badge && (
              <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
                {link.badge}
              </span>
            )}
          </Link>
        ))}
      </nav>
    </div>
  );
}
