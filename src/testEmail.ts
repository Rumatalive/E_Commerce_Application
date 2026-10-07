import "dotenv/config";
import { transporter } from "./config/mail";

const testEmail = async () => {
  try {
    const info = await transporter.sendMail({
      from: `"E-Commerce Application" <${process.env.EMAIL_USER}>`,
      to: "nsanzamhoro250fabrice@gmail.com",
      subject: "Test Email",
      text: "This is a test email from my E-Commerce Application.",
    });

    console.log("Email sent:", info.messageId);
    console.log("Response:", info.response);
  } catch (error) {
    console.error("Email error:", error);
  }
};

testEmail();