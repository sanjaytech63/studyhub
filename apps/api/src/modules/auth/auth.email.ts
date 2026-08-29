import { sendMail } from '@/infrastructure/mail/mail.service';

export interface PasswordResetOtpEmailData {
  email: string;
  firstName: string;
  otp: string;
}

interface SendEmailVerificationOtpEmailInput {
  readonly email: string;
  readonly firstName: string;
  readonly otp: string;
}

export async function sendEmailVerificationOtpEmail({
  email,
  firstName,
  otp,
}: SendEmailVerificationOtpEmailInput): Promise<void> {
  await sendMail({
    to: email,
    subject: 'Verify your StudyHub email',
    text: `Hi ${firstName},

Your StudyHub verification code is ${otp}.

This code will expire soon.

If you did not create a StudyHub account, you can ignore this email.

StudyHub`,
    html: `
      <!DOCTYPE html>
      <html>
        <body>
          <h2>Verify your StudyHub email</h2>

          <p>
            Hi ${firstName},
          </p>

          <p>
            Use the verification code below to verify your email address:
          </p>

          <h1>${otp}</h1>

          <p>
            This code will expire soon.
          </p>

          <p>
            If you did not create a StudyHub account,
            you can safely ignore this email.
          </p>

          <p>
            — StudyHub
          </p>
        </body>
      </html>
    `,
  });
}

export const sendPasswordResetOtpEmail = async ({
  email,
  firstName,
  otp,
}: PasswordResetOtpEmailData): Promise<void> => {
  await sendMail({
    to: email,
    subject: 'StudyHub Password Reset OTP',
    text: [
      `Hello ${firstName},`,
      '',
      `Your StudyHub password reset OTP is: ${otp}`,
      '',
      'This OTP will expire in 10 minutes.',
      '',
      'If you did not request a password reset, you can safely ignore this email.',
    ].join('\n'),
    html: `
      <div>
        <h2>StudyHub Password Reset</h2>

        <p>Hello ${firstName},</p>

        <p>Your password reset OTP is:</p>

        <h1>${otp}</h1>

        <p>This OTP will expire in 10 minutes.</p>

        <p>
          If you did not request a password reset,
          you can safely ignore this email.
        </p>
      </div>
    `,
  });
};

export interface EmailChangeOtpEmailData {
  email: string;
  otp: string;
}

export const sendEmailChangeOtpEmail = async ({
  email,
  otp,
}: EmailChangeOtpEmailData): Promise<void> => {
  await sendMail({
    to: email,
    subject: 'StudyHub Email Change Verification',
    text: [
      'Your StudyHub email change verification code is:',
      '',
      otp,
      '',
      'This code will expire soon.',
      '',
      'If you did not request an email change, please ignore this email.',
    ].join('\n'),
    html: `
      <div>
        <h2>StudyHub Email Change</h2>

        <p>
          Your email change verification code is:
        </p>

        <h1>${otp}</h1>

        <p>
          This code will expire soon.
        </p>

        <p>
          If you did not request an email change,
          please ignore this email.
        </p>
      </div>
    `,
  });
};

export interface EmailChangeOtpEmailData {
  email: string;
  otp: string;
}

export const sendEmailChangeOtpEmai = async ({
  email,
  otp,
}: EmailChangeOtpEmailData): Promise<void> => {
  await sendMail({
    to: email,
    subject: 'StudyHub Email Change Verification',
    text: [
      'Your StudyHub email change verification code is:',
      '',
      otp,
      '',
      'This code will expire soon.',
      '',
      'If you did not request an email change, please ignore this email.',
    ].join('\n'),
    html: `
      <div>
        <h2>StudyHub Email Change</h2>

        <p>
          Your email change verification code is:
        </p>

        <h1>${otp}</h1>

        <p>
          This code will expire soon.
        </p>

        <p>
          If you did not request an email change,
          please ignore this email.
        </p>
      </div>
    `,
  });
};
