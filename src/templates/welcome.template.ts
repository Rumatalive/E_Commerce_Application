export const welcomeEmailTemplate = (name: string): string => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Welcome to E_Commerce_Application</title>
      </head>

      <body>
        <h1>Welcome to E_Commerce_Application</h1>

        <p>Hello, ${name}!</p>

        <p>We're excited to have you on board!</p>

        <p>
          Thank you for creating an account with us.
        </p>
      </body>
    </html>
  `;
};