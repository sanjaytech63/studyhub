import { serverConfig } from '@studyhub/config/server';
import { logger } from '@/config/logger';
import { getMailClient, isSmtpConfigured } from './mail.client';

export interface SendMailInput {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export const sendMail = async ({ to, subject, html, text }: SendMailInput): Promise<void> => {
  const fromAddress =
    serverConfig.email.from ||
    (serverConfig.email.user
      ? `StudyHub <${serverConfig.email.user}>`
      : 'StudyHub <no-reply@studyhubonline.store>');

  if (!isSmtpConfigured()) {
    logger.warn(
      {
        to,
        subject,
        simulatedBody: text,
      },
      '[MAIL SERVICE] SMTP is NOT configured in .env! Email was not delivered to inbox. To receive real emails, set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, and SMTP_FROM.',
    );
    return;
  }

  try {
    const client = getMailClient();
    await client.sendMail({
      from: fromAddress,
      to,
      subject,
      text,
      html,
    });
    logger.info({ to, subject }, '[MAIL SERVICE] Sent email successfully');
  } catch (error) {
    logger.error(
      {
        err: error,
        to,
        subject,
        simulatedBody: text,
      },
      '[MAIL SERVICE ERROR] Failed to send email via SMTP',
    );
    throw error;
  }
};
