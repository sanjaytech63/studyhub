import Link from 'next/link';
import { MarketingContainer } from '../shared/marketing-container';
import { navItems } from '../navbar/navigation';
import { NewsletterForm } from './newsletter-form';
import { companyLinks, legalLinks, resourceLinks, socialLinks } from './footer-navigation';

export function Footer() {
  const currentYear = new Date().getFullYear();
  const productLinks = navItems.filter((item) => item.href !== '/');

  return (
    <footer className="border-t border-border/60 bg-background mb-16 md:mb-0">
      <MarketingContainer>
        {/* =========================================================
            NEWSLETTER
            ========================================================= */}

        <section className="border-b border-border/60 py-10 md:py-14">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            {/* Content */}

            <div className="max-w-xl">
              <span className="text-sm font-medium text-primary">Stay updated</span>

              <h2 className="mt-2 text-xl font-semibold tracking-tight sm:text-2xl">
                Learn something new every week.
              </h2>

              <p className="mt-2 max-w-lg text-sm leading-6 text-muted-foreground">
                Get practical development tips, new courses, engineering resources, and StudyHub
                updates directly in your inbox.
              </p>
            </div>

            {/* Client Component */}

            <NewsletterForm />
          </div>
        </section>

        {/* =========================================================
            MAIN FOOTER
            ========================================================= */}

        <div
          className={[
            'grid gap-10',
            'py-12 md:py-16',
            'sm:grid-cols-2',
            'lg:grid-cols-[1.5fr_repeat(4,1fr)]',
            'lg:gap-8',
          ].join(' ')}
        >
          {/* =======================================================
              BRAND
              ======================================================= */}

          <div className="max-w-sm">
            <Link href="/" aria-label="StudyHub home" className="inline-flex items-center gap-2">
              <span
                className={[
                  'flex size-9 items-center justify-center',
                  'rounded-xl',
                  'bg-primary',
                  'text-sm font-bold',
                  'text-primary-foreground',
                  'shadow-sm',
                ].join(' ')}
              >
                S
              </span>

              <span className="text-lg font-semibold tracking-tight">StudyHub</span>
            </Link>

            <p className="mt-4 max-w-xs text-sm leading-6 text-muted-foreground">
              A modern learning platform for developers who want to learn, build real projects, and
              grow their engineering skills.
            </p>

            {/* =====================================================
                SOCIAL
                ===================================================== */}

            <div className="mt-6 flex items-center gap-2">
              {socialLinks?.map((social) => {
                const Icon = social.icon;

                return (
                  <Link
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className={[
                      'inline-flex size-9 items-center justify-center',
                      'rounded-lg',
                      'border border-border',
                      'text-muted-foreground',
                      'transition-all duration-200',
                      'hover:-translate-y-0.5',
                      'hover:bg-accent',
                      'hover:text-foreground',
                      'focus-visible:outline-none',
                      'focus-visible:ring-2',
                      'focus-visible:ring-ring',
                    ].join(' ')}
                  >
                    <Icon aria-hidden="true" className="size-4" />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* =======================================================
              PRODUCT
              ======================================================= */}

          <FooterLinkGroup title="Product" links={productLinks} />

          {/* =======================================================
              COMPANY
              ======================================================= */}

          <FooterLinkGroup title="Company" links={companyLinks} />

          {/* =======================================================
              RESOURCES
              ======================================================= */}

          <FooterLinkGroup title="Resources" links={resourceLinks} />

          {/* =======================================================
              LEGAL
              ======================================================= */}

          <FooterLinkGroup title="Legal" links={legalLinks} />
        </div>

        {/* =========================================================
            BOTTOM
            ========================================================= */}

        <div
          className={[
            'flex flex-col gap-4',
            'border-t border-border/60',
            'py-6',
            'text-sm text-muted-foreground',
            'sm:flex-row sm:items-center sm:justify-between',
          ].join(' ')}
        >
          <p>© {currentYear} StudyHub. All rights reserved.</p>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Link href="/privacy" className="transition-colors hover:text-foreground">
              Privacy
            </Link>

            <Link href="/terms" className="transition-colors hover:text-foreground">
              Terms
            </Link>

            <Link href="/cookies" className="transition-colors hover:text-foreground">
              Cookies
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

interface FooterLinkGroupProps {
  title: string;
  links: {
    label: string;
    href: string;
  }[];
}

function FooterLinkGroup({ title, links }: FooterLinkGroupProps) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>

      <nav aria-label={`${title} links`} className="mt-4 flex flex-col gap-3">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={[
              'w-fit text-sm',
              'text-muted-foreground',
              'transition-colors duration-200',
              'hover:text-foreground',
            ].join(' ')}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
