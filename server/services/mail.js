import dotenv from 'dotenv';
dotenv.config();

import nodemailer from 'nodemailer';

const {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_SECURE = 'false',
  SMTP_USER,
  SMTP_PASS,
  MAIL_FROM,
} = process.env;

if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS || !MAIL_FROM) {
  throw new Error('Missing SMTP config: set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, MAIL_FROM');
}

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: Number(SMTP_PORT),
  secure: SMTP_SECURE === 'true',
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});

export async function sendVerificationEmail(to, subject, html) {
  const info = await transporter.sendMail({
    from: MAIL_FROM,
    to,
    subject,
    html,
  });
  return info;
}