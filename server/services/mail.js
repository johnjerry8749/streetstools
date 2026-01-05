import nodemailer from 'nodemailer';
import { renderTemplate } from '../templates/emailTemplates.js';
import { renderHtmlTemplate } from './emailTemplate.js';

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
};

// Send email function
export const sendEmail = async (to, subject, html, text = '') => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: to,
      subject: subject,
      html: html,
      text: text
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
    
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message };
  }
};

// Updated notification email function (using JS templates)
export const sendNotificationEmail = async (to, templateName, data) => {
  try {
    const { subject, html } = renderTemplate(templateName, data);
    return await sendEmail(to, subject, html);
  } catch (error) {
    console.error('Error sending notification email:', error);
    return { success: false, error: error.message };
  }
};

// New function for HTML template files
export const sendHtmlNotification = async (to, templateName, data) => {
  try {
    const { subject, html } = await renderHtmlTemplate(templateName, data);
    return await sendEmail(to, subject, html);
  } catch (error) {
    console.error('Error sending HTML email:', error);
    return { success: false, error: error.message };
  }
};