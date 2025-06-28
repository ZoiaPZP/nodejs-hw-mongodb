import nodemailer from 'nodemailer';
import createHttpError from 'http-errors';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export const sendResetEmail = async (to, link) => {
  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to,
      subject: 'Reset your password',
      html: `<p>Click the link to reset your password: <a href="${link}">${link}</a></p>`,
    });
  } catch (error) {
  console.error('Full error sending email:', error?.response?.body || error.message || error);
  throw createHttpError(500, 'Failed to send the email, please try again later.');
  }
};

