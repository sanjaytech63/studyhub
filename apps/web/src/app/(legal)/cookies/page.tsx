import { LegalLayout } from '@/components/legal/legal-layout';
import { LegalSection } from '@/components/legal/legal-section';
import Link from 'next/link';

export const metadata = {
  title: 'Cookie Policy | StudyHub',
  description: 'Learn how StudyHub uses cookies and similar technologies.',
};

export default function CookiesPage() {
  return (
    <LegalLayout
      title="Cookie Policy"
      description="This policy explains how StudyHub uses cookies and similar technologies to provide and improve our services."
      lastUpdated="August 16, 2026"
    >
      <LegalSection id="what-are-cookies" title="1. What Are Cookies?">
        <p>
          Cookies are small text files stored on your device when you visit a website. They allow
          websites to remember information about your session and preferences.
        </p>
      </LegalSection>

      <LegalSection id="how-we-use" title="2. How StudyHub Uses Cookies">
        <p>StudyHub may use cookies and similar technologies for several purposes.</p>

        <ul className="list-disc space-y-2 pl-5">
          <li>Keeping users signed in.</li>
          <li>Maintaining authentication and security.</li>
          <li>Remembering preferences.</li>
          <li>Understanding how the platform is used.</li>
          <li>Improving application performance.</li>
        </ul>
      </LegalSection>

      <LegalSection id="essential" title="3. Essential Cookies">
        <p>
          Some cookies are necessary for the platform to function correctly. These may include
          authentication, security, session management, and other essential functionality.
        </p>
      </LegalSection>

      <LegalSection id="preferences" title="4. Preference Cookies">
        <p>
          Preference cookies allow StudyHub to remember choices such as interface preferences and
          other settings.
        </p>
      </LegalSection>

      <LegalSection id="analytics" title="5. Analytics">
        <p>
          Where enabled, analytics technologies may help us understand how users interact with
          StudyHub. This information helps us identify performance issues and improve the user
          experience.
        </p>
      </LegalSection>

      <LegalSection id="control" title="6. Managing Cookies">
        <p>
          Most browsers allow you to control or delete cookies through their settings. Disabling
          certain cookies may affect the functionality of StudyHub.
        </p>
      </LegalSection>

      <LegalSection id="changes" title="7. Changes to This Policy">
        <p>
          We may update this Cookie Policy when our use of cookies or applicable requirements
          change. The latest version will always be available on this page.
        </p>
      </LegalSection>

      <LegalSection id="contact" title="8. Contact">
        <p>
          If you have questions about our use of cookies, please contact StudyHub through the
          support channels available on the platform.
        </p>

        <p>
          See also our{' '}
          <Link href="/privacy" className="font-medium text-primary hover:underline">
            Privacy Policy
          </Link>
          .
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
