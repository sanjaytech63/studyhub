/* eslint-disable no-console, @typescript-eslint/no-explicit-any */

/**
 * StudyHub SMTP Test & Diagnostics Tool
 *
 * Usage:
 *   npx tsx scripts/test-email.ts [recipient-email]
 *
 * Example:
 *   npx tsx scripts/test-email.ts sanjaytech6375@gmail.com
 */

import 'dotenv/config';
import nodemailer from 'nodemailer';

async function main() {
  const targetEmail = process.argv[2] || process.env.SMTP_USER || 'sanjaytech6375@gmail.com';

  console.log('====================================================');
  console.log('       StudyHub SMTP Diagnostic & Test Tool         ');
  console.log('====================================================\n');

  const host = process.env.SMTP_HOST?.trim() || 'smtp.gmail.com';
  const portStr = process.env.SMTP_PORT?.trim();
  const user = process.env.SMTP_USER?.trim() || 'sanjaytech6375@gmail.com';
  const rawPass = (process.argv[3] || process.env.SMTP_PASSWORD)?.trim();
  const pass = rawPass?.replace(/\s+/g, '');
  const from =
    process.env.SMTP_FROM?.trim() || `"StudyHub" <${user || 'no-reply@studyhubonline.store'}>`;
  const secure = process.env.SMTP_SECURE === 'true' || portStr === '465';

  const port = portStr ? parseInt(portStr, 10) : secure ? 465 : 587;

  console.log('Current SMTP Configuration:');
  console.log(`- SMTP_HOST:     ${host}`);
  console.log(`- SMTP_PORT:     ${port}`);
  console.log(`- SMTP_USER:     ${user}`);
  console.log(
    `- SMTP_PASSWORD: ${pass ? `******** (Length: ${pass.length} chars, spaces stripped)` : '(NOT SET - EMPTY)'}`,
  );
  console.log(`- SMTP_FROM:     ${from}`);
  console.log(`- SMTP_SECURE:   ${secure}`);
  console.log(`- Target Email:  ${targetEmail}\n`);

  if (!host || !user || !pass) {
    console.error('❌ ERROR: SMTP credentials are not fully configured!');
    console.error(
      'You need to provide SMTP_HOST, SMTP_USER, and SMTP_PASSWORD in your .env file or as CLI arguments.\n',
    );
    console.log('To set up Gmail SMTP (Free & Recommended):');
    console.log('1. Go to your Google Account -> Security -> 2-Step Verification.');
    console.log('2. At the bottom, click "App passwords".');
    console.log('3. Create a new App Password called "StudyHub".');
    console.log('4. Copy the 16-character code (e.g. abcd efgh ijkl mnop).');
    console.log('5. Set these variables in .env (or .env.production):');
    console.log('   SMTP_HOST=smtp.gmail.com');
    console.log('   SMTP_PORT=587');
    console.log('   SMTP_USER=your-email@gmail.com');
    console.log('   SMTP_PASSWORD=abcdefghijklmnop');
    console.log('   SMTP_FROM="StudyHub <your-email@gmail.com>"');
    console.log('   SMTP_SECURE=false\n');
    process.exit(1);
  }

  console.log(`Connecting to SMTP server at ${host}:${port}...`);

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  try {
    console.log('Verifying SMTP connection credentials...');
    await transporter.verify();
    console.log('✅ SMTP connection verified successfully!\n');

    console.log(`Sending test email to ${targetEmail}...`);
    const info = await transporter.sendMail({
      from,
      to: targetEmail,
      subject: '✅ StudyHub SMTP Test Email',
      text: `Hello!

This is a test email sent from your StudyHub application.
If you are seeing this email, your SMTP configuration is working perfectly!

OTP verification codes for registration and password reset will now be delivered to user inboxes.

Timestamp: ${new Date().toISOString()}
StudyHub Server`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; border: 1px solid #e0e0e0; border-radius: 8px;">
          <h2 style="color: #4F46E5;">✅ StudyHub SMTP is Working!</h2>
          <p>Hello,</p>
          <p>This is a test email sent from your <strong>StudyHub</strong> platform.</p>
          <p>Your SMTP email configuration is active and working. Users will now receive OTP emails for:</p>
          <ul>
            <li>Account Registration & Email Verification</li>
            <li>Password Reset OTPs</li>
            <li>Email Change Confirmations</li>
          </ul>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 12px; color: #888;">StudyHub Production System &bull; ${new Date().toISOString()}</p>
        </div>
      `,
    });

    console.log('🎉 TEST EMAIL SENT SUCCESSFULLY!');
    console.log(`- Message ID: ${info.messageId}`);
    console.log(`- Response:   ${info.response}`);
    console.log(`\nPlease check the inbox of ${targetEmail} (including Spam/Junk folder).\n`);
  } catch (err: any) {
    console.error('\n❌ FAILED TO SEND EMAIL:');
    console.error(err.message || err);
    if (err.code === 'EAUTH') {
      console.error('\n👉 Authentication failed: Check your SMTP_USER and SMTP_PASSWORD.');
      console.error(
        'If using Gmail, make sure you generated an "App Password", not your normal Google password.',
      );
    } else if (err.code === 'ESOCKET' || err.code === 'ETIMEDOUT') {
      console.error('\n👉 Connection timed out: Check SMTP_HOST and SMTP_PORT, or firewall rules.');
    }
    process.exit(1);
  }
}

main();
