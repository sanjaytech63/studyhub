import { serverConfig } from '@studyhub/config/server';

import { mailClient } from './mail.client';

export interface SendMailInput {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export const sendMail = async ({ to, subject, html, text }: SendMailInput): Promise<void> => {
  await mailClient.sendMail({
    from: serverConfig.email.from,
    to,
    subject,
    text,
    html,
  });
};
