import nodemailer, { type Transporter } from 'nodemailer';
import { serverConfig } from '@studyhub/config/server';

export const mailClient: Transporter = nodemailer.createTransport({
  host: serverConfig.email.host,
  port: serverConfig.email.port,
  secure: serverConfig.email.secure,
  auth: {
    user: serverConfig.email.user,
    pass: serverConfig.email.password,
  },
});
