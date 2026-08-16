import Link from 'next/link';

import { LegalLayout } from '@/components/legal/legal-layout';
import { LegalSection } from '@/components/legal/legal-section';

export const metadata = {
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
      <LegalSection id="overview" title="1. Overview">
        <p>
          StudyHub is committed to protecting your privacy. This policy explains what information we
          collect, why we collect it, and how we use and protect that information.
        </p>

        <p>
          By using StudyHub, you acknowledge that your information may be processed as described in
          this Privacy Policy.
        </p>
      </LegalSection>

      <LegalSection id="information" title="2. Information We Collect">
        <p>
          We may collect information that you provide directly when creating an account or using our
          services.
        </p>

        <ul className="list-disc space-y-2 pl-5">
          <li>Name and account information.</li>
          <li>Email address and contact information.</li>
          <li>Authentication and account security information.</li>
          <li>Learning activity and course progress.</li>
          <li>Information you submit through forms or support requests.</li>
        </ul>

        <p>
          We may also automatically collect technical information such as browser type, device
          information, IP address, and general usage information.
        </p>
      </LegalSection>

      <LegalSection id="usage" title="3. How We Use Information">
        <p>We use collected information to operate, maintain, and improve StudyHub.</p>

        <ul className="list-disc space-y-2 pl-5">
          <li>Provide and personalize our services.</li>
          <li>Authenticate and secure user accounts.</li>
          <li>Track course progress and learning activity.</li>
          <li>Communicate important account information.</li>
          <li>Provide customer support.</li>
          <li>Detect and prevent abuse, fraud, and security issues.</li>
          <li>Improve platform performance and functionality.</li>
        </ul>
      </LegalSection>

      <LegalSection id="security" title="4. Data Security">
        <p>
          We use reasonable technical and organizational safeguards designed to protect your
          information from unauthorized access, alteration, disclosure, or destruction.
        </p>

        <p>
          No internet-based service can guarantee absolute security. You should also use a strong,
          unique password and protect your account credentials.
        </p>
      </LegalSection>

      <LegalSection id="sharing" title="5. Information Sharing">
        <p>
          We do not sell your personal information. We may share information with trusted service
          providers when necessary to operate the platform, provide services, maintain
          infrastructure, or comply with legal obligations.
        </p>
      </LegalSection>

      <LegalSection id="retention" title="6. Data Retention">
        <p>
          We retain information for as long as reasonably necessary to provide our services,
          maintain business records, resolve disputes, enforce agreements, and satisfy legal
          requirements.
        </p>
      </LegalSection>

      <LegalSection id="rights" title="7. Your Rights">
        <p>
          Depending on your location and applicable law, you may have rights regarding access,
          correction, deletion, portability, or restriction of your personal information.
        </p>

        <p>To make a privacy-related request, contact our support team.</p>
      </LegalSection>

      <LegalSection id="contact" title="8. Contact Us">
        <p>
          If you have questions about this Privacy Policy, please contact StudyHub through the
          support channels provided on our platform.
        </p>

        <p>
          You can also review our{' '}
          <Link href="/terms" className="font-medium text-primary hover:underline">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="/cookies" className="font-medium text-primary hover:underline">
            Cookie Policy
          </Link>
          .
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
