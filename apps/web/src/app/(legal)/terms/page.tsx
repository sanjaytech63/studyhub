import Link from 'next/link';

import { LegalLayout } from '@/components/legal/legal-layout';
import { LegalSection } from '@/components/legal/legal-section';

export const metadata = {
  title: 'Terms of Service | StudyHub',
  description: 'Review the terms and conditions that govern your use of StudyHub.',
};

export default function TermsPage() {
  return (
    <LegalLayout
      title="Terms of Service"
      description="These terms govern your access to and use of the StudyHub platform and services."
      lastUpdated="August 16, 2026"
    >
      <LegalSection id="acceptance" title="1. Acceptance of Terms">
        <p>
          By accessing or using StudyHub, you agree to comply with these Terms of Service and all
          applicable laws and regulations.
        </p>

        <p>If you do not agree with these terms, you should not use the platform.</p>
      </LegalSection>

      <LegalSection id="account" title="2. User Accounts">
        <p>
          Some StudyHub features require you to create an account. You are responsible for providing
          accurate information and maintaining the confidentiality of your account credentials.
        </p>

        <p>
          You are responsible for activity performed through your account and should notify us
          promptly if you believe your account has been compromised.
        </p>
      </LegalSection>

      <LegalSection id="acceptable-use" title="3. Acceptable Use">
        <p>
          You agree not to misuse StudyHub or interfere with the operation or security of the
          platform.
        </p>

        <ul className="list-disc space-y-2 pl-5">
          <li>Attempt unauthorized access to accounts or systems.</li>
          <li>Upload malicious or harmful software.</li>
          <li>Abuse, disrupt, or overload platform infrastructure.</li>
          <li>Use the service for unlawful activities.</li>
          <li>Attempt to circumvent security controls.</li>
          <li>Copy or redistribute content without authorization.</li>
        </ul>
      </LegalSection>

      <LegalSection id="content" title="4. User Content">
        <p>
          You retain ownership of content that you submit to StudyHub where applicable. By
          submitting content, you grant StudyHub the permissions reasonably necessary to host,
          process, display, and operate the service.
        </p>

        <p>
          You are responsible for ensuring that your submitted content does not violate applicable
          laws or the rights of others.
        </p>
      </LegalSection>

      <LegalSection id="intellectual-property" title="5. Intellectual Property">
        <p>
          StudyHub and its associated software, design, branding, interfaces, and original content
          are protected by applicable intellectual property laws.
        </p>
      </LegalSection>

      <LegalSection id="availability" title="6. Service Availability">
        <p>
          We aim to keep StudyHub reliable and available, but we do not guarantee uninterrupted or
          error-free operation.
        </p>

        <p>
          Maintenance, upgrades, infrastructure issues, or circumstances outside our reasonable
          control may temporarily affect availability.
        </p>
      </LegalSection>

      <LegalSection id="termination" title="7. Account Suspension and Termination">
        <p>
          We may suspend or terminate accounts that violate these terms, applicable laws, or
          security requirements.
        </p>

        <p>
          You may stop using StudyHub at any time and may request account-related assistance through
          our support channels.
        </p>
      </LegalSection>

      <LegalSection id="changes" title="8. Changes to These Terms">
        <p>
          We may update these Terms of Service from time to time. Updated terms will be published on
          this page with a revised effective date.
        </p>
      </LegalSection>

      <LegalSection id="contact" title="9. Contact">
        <p>
          If you have questions about these terms, please contact StudyHub through the support
          channels available on the platform.
        </p>

        <p>
          For information about how we handle personal information, see our{' '}
          <Link href="/privacy" className="font-medium text-primary hover:underline">
            Privacy Policy
          </Link>
          .
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
