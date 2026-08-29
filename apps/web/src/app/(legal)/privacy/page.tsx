import * as React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ShieldCheck, User, Mail, BookOpen, Lock, FileText, Cookie } from 'lucide-react';

import { LegalLayout } from '@/components/legal/legal-layout';
import { LegalSection } from '@/components/legal/legal-section';

export const metadata: Metadata = {
  title: 'Privacy Policy | StudyHub',
  description:
    'Learn how StudyHub collects, uses, protects, and manages your personal information.',
};

export default function PrivacyPage() {
  return (
    <LegalLayout
      title="Privacy Policy"
      description="This Privacy Policy explains how StudyHub collects, uses, stores, and protects information when you use our platform."
      lastUpdated="August 16, 2026"
    >
      {/* 1. Overview */}
      <LegalSection id="overview" title="1. Overview">
        <p className="leading-relaxed text-muted-foreground">
          StudyHub is committed to protecting your privacy and ensuring transparency about how your
          data is handled. This policy details what information we collect, why we process it, and
          the security measures in place to safeguard your personal details.
        </p>
        <p className="mt-3 leading-relaxed text-muted-foreground">
          By accessing or using StudyHub, you acknowledge that your information will be processed as
          outlined in this Privacy Policy.
        </p>
      </LegalSection>

      {/* 2. Information We Collect */}
      <LegalSection id="information" title="2. Information We Collect">
        <p className="mb-4 leading-relaxed text-muted-foreground">
          We collect information directly from you when you register an account, as well as
          technical data automatically generated during your sessions.
        </p>

        <div className="overflow-x-auto rounded-2xl border border-border/70 bg-background shadow-xs">
          <table className="w-full text-left text-sm text-muted-foreground">
            <thead className="border-b border-border/60 bg-muted/40 text-xs font-semibold uppercase tracking-wider text-foreground">
              <tr>
                <th className="px-4 py-3.5">Data Category</th>
                <th className="px-4 py-3.5">Examples Collected</th>
                <th className="px-4 py-3.5">Collection Method</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              <tr className="hover:bg-muted/20">
                <td className="px-4 py-3.5 font-medium text-foreground">Account Data</td>
                <td className="px-4 py-3.5">Full name, email address, password hash, avatar</td>
                <td className="px-4 py-3.5">Direct user entry</td>
              </tr>
              <tr className="hover:bg-muted/20">
                <td className="px-4 py-3.5 font-medium text-foreground">Learning Activity</td>
                <td className="px-4 py-3.5">
                  Course progress, assessment scores, code workspace edits
                </td>
                <td className="px-4 py-3.5">Automatic application telemetry</td>
              </tr>
              <tr className="hover:bg-muted/20">
                <td className="px-4 py-3.5 font-medium text-foreground">Technical Logs</td>
                <td className="px-4 py-3.5">
                  IP address, browser type, device details, error logs
                </td>
                <td className="px-4 py-3.5">Automated server headers</td>
              </tr>
            </tbody>
          </table>
        </div>
      </LegalSection>

      {/* 3. How We Use Information */}
      <LegalSection id="usage" title="3. How We Use Information">
        <p className="leading-relaxed text-muted-foreground">
          We use collected information to operate, secure, and continuously improve the StudyHub
          experience.
        </p>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="flex items-start gap-3 rounded-xl border border-border/60 bg-muted/20 p-4">
            <User className="mt-0.5 size-5 shrink-0 text-primary" />
            <div>
              <h4 className="text-sm font-semibold text-foreground">Service Personalization</h4>
              <p className="text-xs text-muted-foreground">
                Tailoring course recommendations and remembering your learning state.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-xl border border-border/60 bg-muted/20 p-4">
            <ShieldCheck className="mt-0.5 size-5 shrink-0 text-primary" />
            <div>
              <h4 className="text-sm font-semibold text-foreground">Account Protection</h4>
              <p className="text-xs text-muted-foreground">
                Authenticating users, preventing fraud, and blocking unauthorized access.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-xl border border-border/60 bg-muted/20 p-4">
            <BookOpen className="mt-0.5 size-5 shrink-0 text-primary" />
            <div>
              <h4 className="text-sm font-semibold text-foreground">Progress Tracking</h4>
              <p className="text-xs text-muted-foreground">
                Saving quiz scores, completion certificates, and exercise submissions.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-xl border border-border/60 bg-muted/20 p-4">
            <Mail className="mt-0.5 size-5 shrink-0 text-primary" />
            <div>
              <h4 className="text-sm font-semibold text-foreground">Platform Communications</h4>
              <p className="text-xs text-muted-foreground">
                Sending security alerts, updates, and responses to support inquiries.
              </p>
            </div>
          </div>
        </div>
      </LegalSection>

      {/* 4. Data Security */}
      <LegalSection id="security" title="4. Data Security">
        <p className="leading-relaxed text-muted-foreground">
          We employ industry-standard technical and organizational safeguards designed to protect
          your data against accidental loss, unauthorized access, or misuse.
        </p>

        <div className="mt-4 flex items-start gap-3 rounded-2xl border border-primary/20 bg-primary/5 p-4 text-foreground">
          <Lock className="mt-0.5 size-5 shrink-0 text-primary" />
          <p className="text-xs leading-relaxed text-muted-foreground">
            <strong className="font-semibold text-foreground">Security Reminder:</strong> While we
            enforce modern encryption protocols for data at rest and in transit, no online system is
            100% immune to vulnerabilities. Protect your account by using a strong, unique password.
          </p>
        </div>
      </LegalSection>

      {/* 5. Information Sharing */}
      <LegalSection id="sharing" title="5. Information Sharing">
        <div className="mb-4 flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-emerald-900 dark:text-emerald-200">
          <ShieldCheck className="size-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <span className="text-xs font-semibold">
            StudyHub does not sell, rent, or trade your personal information to third parties.
          </span>
        </div>

        <p className="leading-relaxed text-muted-foreground">
          We share data only with essential infrastructure providers (such as hosting,
          authentication, and analytics services) that operate under strict data protection
          agreements, or when required by legal processes.
        </p>
      </LegalSection>

      {/* 6. Data Retention */}
      <LegalSection id="retention" title="6. Data Retention">
        <p className="leading-relaxed text-muted-foreground">
          We retain your personal information for as long as your account remains active or as
          needed to provide our services. You can request account deletion at any time, after which
          your personal data will be purged or anonymized in accordance with legal requirements.
        </p>
      </LegalSection>

      {/* 7. Your Rights */}
      <LegalSection id="rights" title="7. Your Rights">
        <p className="leading-relaxed text-muted-foreground">
          Depending on your location, you may have rights under regional privacy regulations (such
          as GDPR or CCPA) to access, export, correct, or request deletion of your personal data.
        </p>
      </LegalSection>

      {/* 8. Contact & Next Steps */}
      <LegalSection id="contact" title="8. Contact Us & Related Policies">
        <p className="leading-relaxed text-muted-foreground">
          If you have questions about this Privacy Policy or wish to exercise your privacy rights,
          please reach out via our support channels.
        </p>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link
            href="/terms"
            className="inline-flex items-center gap-2 rounded-xl border border-border/80 bg-background px-4 py-2.5 text-sm font-semibold text-foreground transition-all hover:bg-accent"
          >
            <FileText className="size-4 text-primary" />
            <span>Terms of Service</span>
          </Link>
          <Link
            href="/cookies"
            className="inline-flex items-center gap-2 rounded-xl border border-border/80 bg-background px-4 py-2.5 text-sm font-semibold text-foreground transition-all hover:bg-accent"
          >
            <Cookie className="size-4 text-primary" />
            <span>Cookie Policy</span>
          </Link>
        </div>
      </LegalSection>
    </LegalLayout>
  );
}
