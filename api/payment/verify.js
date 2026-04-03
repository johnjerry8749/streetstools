import axios from 'axios';
import pkg from 'pg';
const { Pool } = pkg;
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();
import nodemailer from 'nodemailer';

// DB setup
const useSsl = process.env.DB_SSL === 'true' || false;
const rejectUnauthorized = process.env.DB_SSL_REJECT_UNAUTHORIZED !== 'false';

const readCert = (envVar) => {
    const value = process.env[envVar];
    if (!value) return undefined;
    if (fs.existsSync(value)) return fs.readFileSync(path.resolve(value)).toString();
    return value;
};

let sslConfig = false;
if (useSsl) {
    const ca = readCert('DB_SSL_CA');
    const cert = readCert('DB_SSL_CERT');
    const key = readCert('DB_SSL_KEY');
    sslConfig = { rejectUnauthorized };
    if (ca) sslConfig.ca = ca;
    if (cert) sslConfig.cert = cert;
    if (key) sslConfig.key = key;
}

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
    ssl: sslConfig,
});

// Mail setup
const {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_SECURE = 'false',
  SMTP_USER,
  SMTP_PASS,
  MAIL_FROM,
} = process.env;

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: Number(SMTP_PORT),
  secure: SMTP_SECURE === 'true',
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});

async function sendVerificationEmail(to, subject, html) {
  const info = await transporter.sendMail({
    from: MAIL_FROM,
    to,
    subject,
    html,
  });
  return info;
}

// Notification helper
async function sendNotificationByEmail(email, { title, message, type = 'info' }) {
  if (!email) {
    throw new Error('Email is required to send notification');
  }
  if (!title || !message) {
    throw new Error('Notification title and message are required');
  }

  const userResult = await pool.query(
    'SELECT id FROM users WHERE email = $1 LIMIT 1',
    [email]
  );

  const userId = userResult.rows?.[0]?.id || null;

  const existingNotification = await pool.query(
    `SELECT id FROM notifications
     WHERE user_id = $1
       AND title = $2
       AND message = $3
       AND created_at >= NOW() - INTERVAL '5 minutes'
     LIMIT 1`,
    [userId, title, message]
  );

  if (existingNotification.rows.length > 0) {
    return { status: 'skipped', message: 'Duplicate notification ignored' };
  }

  await pool.query(
    `INSERT INTO notifications (user_id, title, message, type, is_global, is_read, created_at)
     VALUES ($1, $2, $3, $4, FALSE, FALSE, NOW())`,
    [userId, title, message, type]
  );

  return { status: 'success', message: 'Notification queued' };
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { reference } = req.query;

  if (!reference || typeof reference !== 'string' || reference.length < 5) {
    return res.status(400).json({ message: 'Invalid payment reference' });
  }

  try {
    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = response.data.data;
    const amount = data.amount / 100;
    const productId = data.metadata?.productId || null;
    const downloadFilename = `product_${productId}_file.zip`;
    const email = data.customer?.email?.trim();
    const downloadUrl = `${process.env.BACKEND_URL || 'http://localhost:5000'}/downloads/${downloadFilename}`;

    if (data.status === "success" && email) {
     try {
      await pool.query(
         'INSERT INTO payments (email, amount, reference, download_url, product_id) VALUES ($1, $2, $3, $4, $5)',
         [email, amount, reference, downloadUrl, productId]
       );
       console.log('Payment saved to database for', email);
     } catch (error) {
       console.error('Error saving payment to database', error);
     }

      await sendNotificationByEmail(email, {
        title: "Payment Successful",
        message: `Your payment of ₦${amount} was successful. Reference: ${reference}`,
        type: "success",
      }).catch(err => console.error("Error sending notification", err));

      await sendVerificationEmail(
        email,
        'Payment Confirmation',
        `<p>Dear Customer,</p>
              <p>Your payment of ₦${amount} was successful. Reference: ${reference}</p>
               <p>Thank you for your purchase!</p>
                <p>Download your file here:
                <a href="${downloadUrl}" target="_blank">${downloadUrl}</a>
              </p>`
      ).catch(err => console.error("Error sending email", err));

       console.log("Notification + download Link sent to", email);
  }

    return res.status(200).json({
      status: data.status,
      message: data.gateway_response,
      amount,
      email,
      reference: data.reference,
      downloadUrl: data.status === "success" ? downloadUrl : null
    });
  } catch (error) {
    console.error(error.response?.data || error.message);
    return res.status(500).json({ message: "Payment verification failed" });
  }
}
