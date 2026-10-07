import { transporter } from "../config/mail";
import { welcomeEmailTemplate } from "../utils/emailTemplates";

export const sendEmail = async (
  to: string,
  subject: string,
  html: string
) => {
  try {
    await transporter.sendMail({
      from: `"E_Commerce_Application" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log(`Email sent successfully to ${to}`);
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

export const sendWelcomeEmail = async (
  to: string,
  name: string
) => {
  const subject = "Welcome to E_Commerce_Application";
  const html = welcomeEmailTemplate(name);

  await sendEmail(to, subject, html);
};

export const sendResetCodeEmail = async (
  to: string,
  code: string
) => {
  const subject = "Password Reset Code";

  const html = `
    <div style="font-family: Arial, sans-serif;">
      <h2>Password Reset</h2>

      <p>Hello,</p>

      <p>You requested to reset your password.</p>

      <p>Your password reset code is:</p>

      <h1>${code}</h1>

      <p>This code will expire in 10 minutes.</p>

      <p>If you did not request this password reset, you can ignore this email.</p>
    </div>
  `;

  await sendEmail(to, subject, html);
};