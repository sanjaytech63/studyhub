import Link from 'next/link';

const legalLinks = [
  {
    label: 'Privacy Policy',
    href: '/privacy',
  },
  {
    label: 'Terms of Service',
    href: '/terms',
  },
  {
    label: 'Cookie Policy',
    href: '/cookies',
  },
] as const;

export function LegalNav() {
  return (
    <aside className="hidden w-48 shrink-0 lg:block">
      <nav aria-label="Legal navigation" className="sticky top-24">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Legal
        </p>

        <div className="space-y-1">
          {legalLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </nav>
    </aside>
  );
}
