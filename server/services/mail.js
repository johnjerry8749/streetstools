import nodemailer from 'nodemailer';

// Create email transporter (this is like your email server connection)
const createTransporter = () => {
  return nodemailer.createTransporter({
    service: 'gmail', // You can use gmail, outlook, or other services
    auth: {
      user: process.env.EMAIL_USER, // Your email address
      pass: process.env.EMAIL_PASSWORD // Your email app password
    }
  });
};

// Base function to send emails
export const sendEmail = async (to, subject, htmlContent) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_USER, // Sender email
      to: to, // Recipient email
      subject: subject,
      html: htmlContent
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Email sending failed:', error);
    return { success: false, error: error.message };
  }
};