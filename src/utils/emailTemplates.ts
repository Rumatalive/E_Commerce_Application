export const welcomeEmailTemplate = (name: string): string => {
  return `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2>Welcome to E_Commerce_Application!</h2>

      <p>Hello ${name},</p>

      <p>
        Welcome to our E-Commerce Application.
        Your account has been created successfully.
      </p>

      <p>Thank you for joining us!</p>

      <p>
        Best regards,<br>
        E_Commerce_Application Team
      </p>
    </div>
  `;
};