import { Resend } from 'resend';

// Initialize Resend only when API key is available
const getResend = () => {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error('RESEND_API_KEY is not configured');
  }
  return new Resend(apiKey);
};

// Email templates
const SIGNUP_EMAIL_TEMPLATE = (email: string, token: string, baseUrl: string) => ({
  subject: "Verify your email address - unusual-directory",
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Welcome to unusual-directory!</h2>
      <p>Hi there,</p>
      <p>Thanks for signing up! Please verify your email address by clicking the button below:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${baseUrl}/verify?token=${token}&email=${encodeURIComponent(email)}" 
           style="background-color: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
          Verify Email Address
        </a>
      </div>
      <p>Or copy and paste this link into your browser:</p>
      <p style="word-break: break-all; color: #666;">
        ${baseUrl}/verify?token=${token}&email=${encodeURIComponent(email)}
      </p>
      <p>This link will expire in 24 hours.</p>
      <p>If you didn't create an account, you can safely ignore this email.</p>
      <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
      <p style="color: #666; font-size: 14px;">
        Best regards,<br>
        The unusual-directory team
      </p>
    </div>
  `
});

const SIGNIN_EMAIL_TEMPLATE = (email: string, token: string, baseUrl: string) => ({
  subject: "Sign in to unusual-directory",
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Sign in to unusual-directory</h2>
      <p>Hi there,</p>
      <p>You requested to sign in to your account. Click the button below to complete the sign-in process:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${baseUrl}/verify?token=${token}&email=${encodeURIComponent(email)}" 
           style="background-color: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
          Sign In
        </a>
      </div>
      <p>Or copy and paste this link into your browser:</p>
      <p style="word-break: break-all; color: #666;">
        ${baseUrl}/verify?token=${token}&email=${encodeURIComponent(email)}
      </p>
      <p>This link will expire in 24 hours.</p>
      <p>If you didn't request to sign in, you can safely ignore this email.</p>
      <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
      <p style="color: #666; font-size: 14px;">
        Best regards,<br>
        The unusual-directory team
      </p>
    </div>
  `
});

// Send signup verification email
export async function sendSignupEmail(email: string, token: string) {
  try {
    const resend = getResend();
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://dir.nahar.tv';
    const { subject, html } = SIGNUP_EMAIL_TEMPLATE(email, token, baseUrl);

    const { data, error } = await resend.emails.send({
      from: 'unusual-directory <noreply@dir.nahar.tv>',
      to: [email],
      subject,
      html,
    });

    if (error) {
      console.error('Error sending signup email:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error sending signup email:', error);
    return { success: false, error: 'Failed to send email' };
  }
}

// Send signin verification email
export async function sendSigninEmail(email: string, token: string) {
  try {
    const resend = getResend();
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://dir.nahar.tv';
    const { subject, html } = SIGNIN_EMAIL_TEMPLATE(email, token, baseUrl);

    const { data, error } = await resend.emails.send({
      from: 'unusual-directory <noreply@dir.nahar.tv>',
      to: [email],
      subject,
      html,
    });

    if (error) {
      console.error('Error sending signin email:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error sending signin email:', error);
    return { success: false, error: 'Failed to send email' };
  }
}
