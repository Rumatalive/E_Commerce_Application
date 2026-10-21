
import { transporter } from "../config/mail";
import {
  welcomeEmailTemplate,
  orderConfirmationEmailTemplate,
} from "../utils/emailTemplates";

export const sendEmail = async (
  to: string,
  subject: string,
  html: string,
): Promise<void> => {
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

// Welcome email after registration
export const sendWelcomeEmail = async (
  to: string,
  name: string,
): Promise<void> => {
  const subject = "Welcome to E_Commerce_Application";
  const html = welcomeEmailTemplate(name);

  await sendEmail(to, subject, html);
};

// Order confirmation after an order is created
export const sendOrderConfirmationEmail = async (
  to: string,
  name: string,
  orderId: string,
  items: {
    name: string;
    quantity: number;
    price: number;
  }[],
  totalAmount: number,
  shippingAddress: string,
): Promise<void> => {
  const subject = `Order Confirmation #${orderId}`;

  const html = orderConfirmationEmailTemplate(
    name,
    orderId,
    items,
    totalAmount,
    shippingAddress,
  );

  await sendEmail(to, subject, html);
};

// Password reset email
export const sendResetCodeEmail = async (
  to: string,
  code: string,
): Promise<void> => {
  const subject = "Password Reset Code";

  const html = `
    <div style="font-family: Arial, sans-serif;">
      <h2>Password Reset</h2>
      <p>Your password reset code is:</p>
      <h1>${code}</h1>
      <p>This code will expire in 10 minutes.</p>
      <p>If you did not request a password reset, you can ignore this email.</p>
    </div>
  `;

  await sendEmail(to, subject, html);
};