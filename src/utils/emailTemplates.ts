
export const welcomeEmailTemplate = (name: string): string => {
  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Welcome to E_Commerce_Application</title>
      </head>

      <body
        style="
          margin: 0;
          padding: 0;
          background-color: #f4f6f8;
          font-family: Arial, Helvetica, sans-serif;
          color: #333333;
        "
      >
        <table
          width="100%"
          cellpadding="0"
          cellspacing="0"
          border="0"
          style="background-color: #f4f6f8; padding: 40px 20px;"
        >
          <tr>
            <td align="center">

              <table
                width="100%"
                cellpadding="0"
                cellspacing="0"
                border="0"
                style="
                  max-width: 600px;
                  background-color: #ffffff;
                  border-radius: 10px;
                  overflow: hidden;
                  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
                "
              >

                <!-- Header -->
                <tr>
                  <td
                    style="
                      background-color: #111827;
                      padding: 30px 40px;
                      text-align: center;
                    "
                  >
                    <h1
                      style="
                        margin: 0;
                        color: #ffffff;
                        font-size: 26px;
                        font-weight: 600;
                      "
                    >
                      E_Commerce_Application
                    </h1>

                    <p
                      style="
                        margin: 8px 0 0;
                        color: #d1d5db;
                        font-size: 14px;
                      "
                    >
                      Welcome to our community
                    </p>
                  </td>
                </tr>

                <!-- Content -->
                <tr>
                  <td style="padding: 40px;">

                    <h2
                      style="
                        margin: 0 0 20px;
                        color: #111827;
                        font-size: 24px;
                      "
                    >
                      Welcome, ${name}! 👋
                    </h2>

                    <p
                      style="
                        margin: 0 0 18px;
                        font-size: 16px;
                        line-height: 1.7;
                        color: #4b5563;
                      "
                    >
                      Thank you for creating an account with
                      <strong>E_Commerce_Application</strong>.
                      We're excited to have you with us.
                    </p>

                    <p
                      style="
                        margin: 0 0 24px;
                        font-size: 16px;
                        line-height: 1.7;
                        color: #4b5563;
                      "
                    >
                      Your account has been successfully created. You can now
                      explore our products and enjoy a simple and convenient
                      shopping experience.
                    </p>

                    <!-- Button -->
                    <table
                      cellpadding="0"
                      cellspacing="0"
                      border="0"
                      style="margin: 30px auto;"
                    >
                      <tr>
                        <td
                          align="center"
                          style="
                            border-radius: 6px;
                            background-color: #111827;
                          "
                        >
                          <a
                            href="https://e-commerce-application-5-7fyn.onrender.com"
                            style="
                              display: inline-block;
                              padding: 14px 28px;
                              color: #ffffff;
                              text-decoration: none;
                              font-size: 15px;
                              font-weight: 600;
                            "
                          >
                            Start Shopping
                          </a>
                        </td>
                      </tr>
                    </table>

                    <p
                      style="
                        margin: 0;
                        font-size: 14px;
                        line-height: 1.6;
                        color: #6b7280;
                      "
                    >
                      If you did not create this account, please contact our
                      support team immediately.
                    </p>

                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td
                    style="
                      padding: 25px 40px;
                      background-color: #f9fafb;
                      border-top: 1px solid #e5e7eb;
                      text-align: center;
                    "
                  >
                    <p
                      style="
                        margin: 0 0 8px;
                        font-size: 13px;
                        color: #6b7280;
                      "
                    >
                      © ${new Date().getFullYear()} E_Commerce_Application.
                      All rights reserved.
                    </p>

                    <p
                      style="
                        margin: 0;
                        font-size: 12px;
                        color: #9ca3af;
                      "
                    >
                      This is an automated email. Please do not reply directly
                      to this message.
                    </p>
                  </td>
                </tr>

              </table>

            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
};

export const orderConfirmationEmailTemplate = (
  name: string,
  orderId: string,
  items: {
    name: string;
    quantity: number;
    price: number;
  }[],
  totalAmount: number,
  shippingAddress: string,
): string => {
  const itemsHtml = items
    .map(
      (item) => `
        <tr>
          <td
            style="
              padding: 14px 10px;
              border-bottom: 1px solid #e5e7eb;
              color: #374151;
              font-size: 14px;
            "
          >
            ${item.name}
          </td>

          <td
            align="center"
            style="
              padding: 14px 10px;
              border-bottom: 1px solid #e5e7eb;
              color: #374151;
              font-size: 14px;
            "
          >
            ${item.quantity}
          </td>

          <td
            align="right"
            style="
              padding: 14px 10px;
              border-bottom: 1px solid #e5e7eb;
              color: #374151;
              font-size: 14px;
            "
          >
            ${item.price.toLocaleString()} RWF
          </td>
        </tr>
      `,
    )
    .join("");

  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Order Confirmation</title>
      </head>

      <body
        style="
          margin: 0;
          padding: 0;
          background-color: #f4f6f8;
          font-family: Arial, Helvetica, sans-serif;
          color: #333333;
        "
      >
        <table
          width="100%"
          cellpadding="0"
          cellspacing="0"
          border="0"
          style="background-color: #f4f6f8; padding: 40px 20px;"
        >
          <tr>
            <td align="center">

              <table
                width="100%"
                cellpadding="0"
                cellspacing="0"
                border="0"
                style="
                  max-width: 650px;
                  background-color: #ffffff;
                  border-radius: 10px;
                  overflow: hidden;
                "
              >

                <!-- Header -->
                <tr>
                  <td
                    style="
                      background-color: #111827;
                      padding: 30px 40px;
                      text-align: center;
                    "
                  >
                    <h1
                      style="
                        margin: 0;
                        color: #ffffff;
                        font-size: 26px;
                      "
                    >
                      E_Commerce_Application
                    </h1>

                    <p
                      style="
                        margin: 8px 0 0;
                        color: #d1d5db;
                        font-size: 14px;
                      "
                    >
                      Order Confirmation
                    </p>
                  </td>
                </tr>

                <!-- Content -->
                <tr>
                  <td style="padding: 40px;">

                    <h2
                      style="
                        margin: 0 0 20px;
                        color: #111827;
                        font-size: 24px;
                      "
                    >
                      Thank you, ${name}! 🎉
                    </h2>

                    <p
                      style="
                        margin: 0 0 20px;
                        color: #4b5563;
                        font-size: 16px;
                        line-height: 1.7;
                      "
                    >
                      Your order has been successfully placed.
                      We have received your order and will begin processing it soon.
                    </p>

                    <!-- Order information -->
                    <table
                      width="100%"
                      cellpadding="0"
                      cellspacing="0"
                      border="0"
                      style="
                        background-color: #f9fafb;
                        border-radius: 8px;
                        margin-bottom: 30px;
                      "
                    >
                      <tr>
                        <td style="padding: 20px;">

                          <p style="margin: 0 0 10px; font-size: 14px;">
                            <strong>Order ID:</strong> ${orderId}
                          </p>

                          <p style="margin: 0; font-size: 14px;">
                            <strong>Status:</strong>
                            <span style="color: #d97706;">
                              Pending
                            </span>
                          </p>

                        </td>
                      </tr>
                    </table>

                    <!-- Products -->
                    <h3
                      style="
                        margin: 0 0 15px;
                        color: #111827;
                        font-size: 18px;
                      "
                    >
                      Order Details
                    </h3>

                    <table
                      width="100%"
                      cellpadding="0"
                      cellspacing="0"
                      border="0"
                      style="border-collapse: collapse;"
                    >
                      <thead>
                        <tr>
                          <th
                            align="left"
                            style="
                              padding: 12px 10px;
                              border-bottom: 2px solid #111827;
                              font-size: 13px;
                            "
                          >
                            Product
                          </th>

                          <th
                            align="center"
                            style="
                              padding: 12px 10px;
                              border-bottom: 2px solid #111827;
                              font-size: 13px;
                            "
                          >
                            Quantity
                          </th>

                          <th
                            align="right"
                            style="
                              padding: 12px 10px;
                              border-bottom: 2px solid #111827;
                              font-size: 13px;
                            "
                          >
                            Price
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        ${itemsHtml}
                      </tbody>
                    </table>

                    <!-- Total -->
                    <table
                      width="100%"
                      cellpadding="0"
                      cellspacing="0"
                      border="0"
                      style="margin-top: 25px;"
                    >
                      <tr>
                        <td
                          align="right"
                          style="
                            padding: 15px 10px;
                            font-size: 20px;
                            color: #111827;
                          "
                        >
                          <strong>
                            Total: ${totalAmount.toLocaleString()} RWF
                          </strong>
                        </td>
                      </tr>
                    </table>

                    <!-- Shipping -->
                    <div
                      style="
                        margin-top: 25px;
                        padding: 20px;
                        background-color: #f9fafb;
                        border-radius: 8px;
                      "
                    >
                      <h3
                        style="
                          margin: 0 0 10px;
                          font-size: 16px;
                          color: #111827;
                        "
                      >
                        Shipping Address
                      </h3>

                      <p
                        style="
                          margin: 0;
                          color: #4b5563;
                          font-size: 14px;
                        "
                      >
                        ${shippingAddress}
                      </p>
                    </div>

                    <!-- Payment -->
                    <p
                      style="
                        margin-top: 25px;
                        color: #4b5563;
                        font-size: 14px;
                      "
                    >
                      <strong>Payment Status:</strong> Unpaid
                    </p>

                    <p
                      style="
                        margin-top: 25px;
                        color: #4b5563;
                        font-size: 14px;
                        line-height: 1.6;
                      "
                    >
                      We will notify you when your order status changes.
                    </p>

                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td
                    style="
                      padding: 25px 40px;
                      background-color: #f9fafb;
                      border-top: 1px solid #e5e7eb;
                      text-align: center;
                    "
                  >
                    <p
                      style="
                        margin: 0;
                        font-size: 13px;
                        color: #6b7280;
                      "
                    >
                      © ${new Date().getFullYear()}
                      E_Commerce_Application.
                      All rights reserved.
                    </p>

                    <p
                      style="
                        margin: 8px 0 0;
                        font-size: 12px;
                        color: #9ca3af;
                      "
                    >
                      Thank you for shopping with us.
                    </p>
                  </td>
                </tr>

              </table>

            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
};