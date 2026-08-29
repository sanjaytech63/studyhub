import * as React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import {
  UserCheck,
  Ban,
  UploadCloud,
  Shield,
  Cookie,
  AlertOctagon,
  ShieldAlert,
  CopyX,
} from 'lucide-react';

import { LegalLayout } from '@/components/legal/legal-layout';
import { LegalSection } from '@/components/legal/legal-section';

export const metadata: Metadata = {
  title: 'Terms of Service | StudyHub',
  description: 'Review the terms and conditions that govern your access to and use of StudyHub.',
};

export default function TermsPage() {
  return (
    <LegalLayout
      title="Terms of Service"
      description="These terms govern your access to and use of the StudyHub platform, application, and related services."
      lastUpdated="August 16, 2026"
    >
      {/* 1. Acceptance of Terms */}
      <LegalSection id="acceptance" title="1. Acceptance of Terms">
        <p className="leading-relaxed text-muted-foreground">
          By accessing, registering for, or using StudyHub, you agree to be bound by these Terms of
          Service and all applicable federal, state, and local laws and regulations.
        </p>

        <div className="mt-4 flex items-start gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4 text-amber-900 dark:text-amber-200">
          <AlertOctagon className="mt-0.5 size-5 shrink-0 text-amber-600 dark:text-amber-400" />
          <p className="text-xs leading-relaxed">
            <strong className="font-semibold">Important Notice:</strong> If you do not agree with
            any part of these terms, you are prohibited from accessing or using the StudyHub
            platform and should discontinue use immediately.
          </p>
        </div>
      </LegalSection>

      {/* 2. User Accounts */}
      <LegalSection id="account" title="2. User Accounts & Security">
        <p className="leading-relaxed text-muted-foreground">
          Certain areas of StudyHub require you to create a registered user account. You agree to
          provide current, complete, and accurate information during registration.
        </p>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="flex items-start gap-3 rounded-xl border border-border/60 bg-muted/20 p-4">
            <UserCheck className="mt-0.5 size-5 shrink-0 text-primary" />
            <div>
              <h4 className="text-sm font-semibold text-foreground">Credential Confidentiality</h4>
              <p className="text-xs text-muted-foreground">
                You are solely responsible for maintaining password security and controlling account
                access.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-xl border border-border/60 bg-muted/20 p-4">
            <ShieldAlert className="mt-0.5 size-5 shrink-0 text-primary" />
            <div>
              <h4 className="text-sm font-semibold text-foreground">
                Unauthorized Access Notification
              </h4>
              <p className="text-xs text-muted-foreground">
                Promptly notify support if you detect or suspect any unauthorized breach or account
                misuse.
              </p>
            </div>
          </div>
        </div>
      </LegalSection>

      {/* 3. Acceptable Use */}
      <LegalSection id="acceptable-use" title="3. Acceptable Use & Conduct Rules">
        <p className="mb-4 leading-relaxed text-muted-foreground">
          To preserve platform integrity and secure our user community, you agree not to engage in
          any of the following prohibited activities:
        </p>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="flex items-start gap-3 rounded-xl border border-destructive/20 bg-destructive/5 p-3.5">
            <Ban className="mt-0.5 size-4.5 shrink-0 text-destructive" />
            <div className="text-xs leading-relaxed text-muted-foreground">
              <strong className="font-semibold text-foreground">Unauthorized Access:</strong>{' '}
              Attempting to probe, scan, or bypass platform security controls.
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-xl border border-destructive/20 bg-destructive/5 p-3.5">
            <Ban className="mt-0.5 size-4.5 shrink-0 text-destructive" />
            <div className="text-xs leading-relaxed text-muted-foreground">
              <strong className="font-semibold text-foreground">Malicious Code:</strong> Uploading
              viruses, worms, or software intended to harm systems or data.
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-xl border border-destructive/20 bg-destructive/5 p-3.5">
            <Ban className="mt-0.5 size-4.5 shrink-0 text-destructive" />
            <div className="text-xs leading-relaxed text-muted-foreground">
              <strong className="font-semibold text-foreground">Infrastructure Abuse:</strong>{' '}
              Overloading API routes or deploying automated scraping bots.
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-xl border border-destructive/20 bg-destructive/5 p-3.5">
            <CopyX className="mt-0.5 size-4.5 shrink-0 text-destructive" />
            <div className="text-xs leading-relaxed text-muted-foreground">
              <strong className="font-semibold text-foreground">Content Piracy:</strong>{' '}
              Redistributing, reselling, or copying proprietary course materials.
            </div>
          </div>
        </div>
      </LegalSection>

      {/* 4. User Content */}
      <LegalSection id="content" title="4. User Content Ownership">
        <p className="leading-relaxed text-muted-foreground">
          You retain full intellectual property rights to the code snippets, course notes, and
          assignments you submit to StudyHub.
        </p>

        <div className="mt-4 flex items-start gap-3 rounded-2xl border border-primary/20 bg-primary/5 p-4 text-foreground">
          <UploadCloud className="mt-0.5 size-5 shrink-0 text-primary" />
          <p className="text-xs leading-relaxed text-muted-foreground">
            <strong className="font-semibold text-foreground">Platform License:</strong> By
            submitting content, you grant StudyHub a worldwide, non-exclusive, royalty-free license
            to host, execute, display, and process your code solely for operating and delivering
            requested platform features to you.
          </p>
        </div>
      </LegalSection>

      {/* 5. Intellectual Property */}
      <LegalSection id="intellectual-property" title="5. Intellectual Property">
        <p className="leading-relaxed text-muted-foreground">
          All StudyHub interface designs, brand assets, code editors, interactive modules, logos,
          and original course content are the exclusive property of StudyHub and protected by
          copyright, trademark, and international IP treaties.
        </p>
      </LegalSection>

      {/* 6. Service Availability */}
      <LegalSection id="availability" title="6. Service Availability & Uptime">
        <p className="leading-relaxed text-muted-foreground">
          While we strive for consistent uptime and high performance, StudyHub services are provided
          on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis. Scheduled maintenance,
          system upgrades, or unforeseen server outages may temporarily affect availability.
        </p>
      </LegalSection>

      {/* 7. Suspension & Termination */}
      <LegalSection id="termination" title="7. Suspension and Termination">
        <p className="leading-relaxed text-muted-foreground">
          StudyHub reserves the right to suspend or permanently terminate user accounts that violate
          these Terms of Service, engage in illegal activity, or pose security risks to other
          platform members.
        </p>
        <p className="mt-3 leading-relaxed text-muted-foreground">
          You may close your account at any time through your account settings or by contacting our
          support team.
        </p>
      </LegalSection>

      {/* 8. Changes to Terms */}
      <LegalSection id="changes" title="8. Modifications to Terms">
        <p className="leading-relaxed text-muted-foreground">
          We may modify these Terms of Service periodically to adapt to platform changes or updated
          legal obligations. Continued use of StudyHub after updated terms are published constitutes
          acceptance of those changes.
        </p>
      </LegalSection>

      {/* 9. Contact & Cross-Links */}
      <LegalSection id="contact" title="9. Contact & Legal Enquiries">
        <p className="leading-relaxed text-muted-foreground">
          If you have questions regarding these Terms of Service or need legal support, please
          contact the StudyHub team through our platform help desk.
        </p>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link
            href="/privacy"
            className="inline-flex items-center gap-2 rounded-xl border border-border/80 bg-background px-4 py-2.5 text-sm font-semibold text-foreground transition-all hover:bg-accent"
          >
            <Shield className="size-4 text-primary" />
            <span>Privacy Policy</span>
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
