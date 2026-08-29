import * as React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Shield, Cookie, Info, Lock, Settings2, BarChart2 } from 'lucide-react';

import { LegalLayout } from '@/components/legal/legal-layout';
import { LegalSection } from '@/components/legal/legal-section';

export const metadata: Metadata = {
  title: 'Cookie Policy | StudyHub',
  description:
    'Learn how StudyHub uses cookies and similar technologies to manage your session and improve user experience.',
};

export default function CookiesPage() {
  return (
    <LegalLayout
      title="Cookie Policy"
      description="This policy explains how StudyHub uses cookies and similar technologies to provide, secure, and improve our services."
      lastUpdated="August 16, 2026"
    >
      {/* 1. What Are Cookies */}
      <LegalSection id="what-are-cookies" title="1. What Are Cookies?">
        <p className="leading-relaxed text-muted-foreground">
          Cookies are small text files that are placed on your computer or mobile device when you
          visit a website. They are widely used by website owners to make their platforms work more
          efficiently, provide customized user experiences, and report operational analytics.
        </p>
      </LegalSection>

      {/* 2. How We Use Cookies */}
      <LegalSection id="how-we-use" title="2. How StudyHub Uses Cookies">
        <p className="leading-relaxed text-muted-foreground">
          StudyHub uses cookies and local storage technologies for several vital platform
          operations:
        </p>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="flex items-start gap-3 rounded-xl border border-border/60 bg-muted/20 p-4">
            <Lock className="mt-0.5 size-5 shrink-0 text-primary" />
            <div>
              <h4 className="text-sm font-semibold text-foreground">Authentication & Security</h4>
              <p className="text-xs text-muted-foreground">
                Keeping you signed in securely and protecting your account data.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-xl border border-border/60 bg-muted/20 p-4">
            <Settings2 className="mt-0.5 size-5 shrink-0 text-primary" />
            <div>
              <h4 className="text-sm font-semibold text-foreground">Preferences & Theme</h4>
              <p className="text-xs text-muted-foreground">
                Remembering choices like dark mode, layout settings, and language.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-xl border border-border/60 bg-muted/20 p-4">
            <BarChart2 className="mt-0.5 size-5 shrink-0 text-primary" />
            <div>
              <h4 className="text-sm font-semibold text-foreground">Performance & Analytics</h4>
              <p className="text-xs text-muted-foreground">
                Understanding usage patterns to optimize speed and feature stability.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-xl border border-border/60 bg-muted/20 p-4">
            <Cookie className="mt-0.5 size-5 shrink-0 text-primary" />
            <div>
              <h4 className="text-sm font-semibold text-foreground">Session State</h4>
              <p className="text-xs text-muted-foreground">
                Preserving course progress and code workspace state across refreshes.
              </p>
            </div>
          </div>
        </div>
      </LegalSection>

      {/* 3. Detailed Cookie Classification Table */}
      <LegalSection id="cookie-breakdown" title="3. Categories of Cookies We Set">
        <p className="mb-4 leading-relaxed text-muted-foreground">
          The table below outlines the specific cookies StudyHub utilizes and why they are set.
        </p>

        <div className="overflow-x-auto rounded-2xl border border-border/70 bg-background shadow-xs">
          <table className="w-full text-left text-sm text-muted-foreground">
            <thead className="border-b border-border/60 bg-muted/40 text-xs font-semibold uppercase tracking-wider text-foreground">
              <tr>
                <th className="px-4 py-3.5">Category</th>
                <th className="px-4 py-3.5">Purpose</th>
                <th className="px-4 py-3.5">Duration</th>
                <th className="px-4 py-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              <tr className="hover:bg-muted/20">
                <td className="px-4 py-3.5 font-medium text-foreground">Essential / Auth</td>
                <td className="px-4 py-3.5">
                  Maintains user auth token, session state, and CSRF protection.
                </td>
                <td className="px-4 py-3.5">Session / 30 Days</td>
                <td className="px-4 py-3.5">
                  <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                    Always Active
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-muted/20">
                <td className="px-4 py-3.5 font-medium text-foreground">Preferences</td>
                <td className="px-4 py-3.5">
                  Stores interface theme (light/dark) and editor sidebar positions.
                </td>
                <td className="px-4 py-3.5">1 Year</td>
                <td className="px-4 py-3.5">
                  <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                    Always Active
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-muted/20">
                <td className="px-4 py-3.5 font-medium text-foreground">Analytics</td>
                <td className="px-4 py-3.5">
                  Measures page view performance, error rates, and navigation paths.
                </td>
                <td className="px-4 py-3.5">90 Days</td>
                <td className="px-4 py-3.5">
                  <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
                    Optional
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </LegalSection>

      {/* 4. Managing Cookies */}
      <LegalSection id="control" title="4. Managing & Disabling Cookies">
        <p className="leading-relaxed text-muted-foreground">
          Most web browsers allow you to manage your cookie preferences through their settings menu.
          You can set your browser to refuse cookies or delete existing ones.
        </p>

        <div className="mt-4 flex items-start gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4 text-amber-900 dark:text-amber-200">
          <Info className="mt-0.5 size-5 shrink-0 text-amber-600 dark:text-amber-400" />
          <p className="text-xs leading-relaxed">
            <strong className="font-semibold">Note:</strong> Blocking essential cookies may disrupt
            authentication, cause layout errors, or prevent access to members-only course features
            on StudyHub.
          </p>
        </div>
      </LegalSection>

      {/* 5. Policy Updates */}
      <LegalSection id="changes" title="5. Updates to This Policy">
        <p className="leading-relaxed text-muted-foreground">
          We may update this Cookie Policy periodically to reflect changes in legal obligations or
          operational functionality. The updated date at the top of this page indicates when changes
          were last applied.
        </p>
      </LegalSection>

      {/* 6. Contact & Privacy References */}
      <LegalSection id="contact" title="6. Contact & Resources">
        <p className="leading-relaxed text-muted-foreground">
          If you have questions regarding our use of cookies, please reach out to our team through
          the platform help center.
        </p>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link
            href="/privacy"
            className="inline-flex items-center gap-2 rounded-xl border border-border/80 bg-background px-4 py-2.5 text-sm font-semibold text-foreground transition-all hover:bg-accent"
          >
            <Shield className="size-4 text-primary" />
            <span>Read Privacy Policy</span>
          </Link>
          <Link
            href="/terms"
            className="inline-flex items-center gap-2 rounded-xl border border-border/80 bg-background px-4 py-2.5 text-sm font-semibold text-foreground transition-all hover:bg-accent"
          >
            <span>Terms of Service</span>
          </Link>
        </div>
      </LegalSection>
    </LegalLayout>
  );
}
