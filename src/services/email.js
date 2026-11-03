import createHttpError from 'http-errors';

export const sendResetEmail = async (to, link) => {
  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'api-key': process.env.BREVO_API_KEY,
      },
      body: JSON.stringify({
        sender: { email: process.env.SMTP_FROM },
        to: [{ email: to }],
        subject: 'Reset your password',
        htmlContent: `<p>Click the link to reset your password: <a href="${link}">${link}</a></p>`,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Brevo API error: ${response.status} ${errorBody}`);
    }
  } catch (error) {
    console.error('Full error sending email:', error?.message || error);
    throw createHttpError(500, 'Failed to send the email, please try again later.');
  }
};
