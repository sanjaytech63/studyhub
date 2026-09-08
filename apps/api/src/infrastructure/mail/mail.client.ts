import nodemailer, { type Transporter } from 'nodemailer';
import { serverConfig } from '@studyhub/config/server';

let cachedClient: Transporter | null = null;

export const isSmtpConfigured = (): boolean => {
  return Boolean(serverConfig.email.host && serverConfig.email.user && serverConfig.email.password);
};

export const getMailClient = (): Transporter => {
  if (cachedClient) {
    return cachedClient;
  }

  const port = serverConfig.email.port || 587;
  const secure = serverConfig.email.secure ?? port === 465;

  cachedClient = nodemailer.createTransport({
    host: serverConfig.email.host || 'localhost',
    port,
    secure,
    ...(serverConfig.email.user && serverConfig.email.password
      ? {
          auth: {
            user: serverConfig.email.user,
            pass: serverConfig.email.password,
          },
        }
      : {}),
  });

  return cachedClient;
};

export const mailClient: Transporter = getMailClient();
