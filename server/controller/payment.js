import axios from 'axios';
import { sendNotificationByEmail } from './notificationcontroller.js';
import { sendVerificationEmail } from '../services/mail.js';
import pool from '../config/db.js';


export const Payment = async (req, res) => {
  try {
    const { email, amount } = req.body;

    const trimmedEmail = email?.trim();
    if (!trimmedEmail || !trimmedEmail.includes('@')) {
      console.log('Invalid email received:', email);
      return res.status(400).json({ message: 'Invalid email address' });
    }

    console.log('Valid email:', trimmedEmail);

    const callbackUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment/callback`;
    console.log('Paystack callback URL:', callbackUrl);

    const response = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        email: trimmedEmail,
        amount: amount * 100, // convert to kobo
        callback_url: callbackUrl
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log('Paystack response:', response.data);

    // send Paystack checkout URL to frontend
    res.status(200).json({
      authorization_url: response.data.data.authorization_url,
    });

  } catch (error) {
    console.error(error.response?.data || error.message);

    res.status(500).json({
      message: "Payment initialization failed",
    });
  }
};


export const verifyPayment = async (req, res) => {
  const { reference } = req.query;

// Validate reference
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
    const downloadFilename = `product_${productId}_file.zip`; // Example filename based on product ID
    const email = data.customer?.email?.trim();
    const downloadUrl = `${process.env.BACKEND_URL || 'http://localhost:5000'}/downloads/${downloadFilename}`;

      //Save Reference Payment to database  
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
     // send notification/email only if payment was successful and email is valid
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
};