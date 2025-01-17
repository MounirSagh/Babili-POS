import { createTransport, TransportOptions, getTestMessageUrl, SentMessageInfo } from "nodemailer";
require('dotenv').config();

const transporter = createTransport({
  service: 'Outlook',
  port: 587,
  auth: {
      user: process.env.BABILY_EMAIL,
      pass: process.env.BABILY_PASSWORD 
  }
} as TransportOptions);

export async function sendApprovalEmailService(toEmail: string) {
  console.log(toEmail)
  transporter.sendMail({
    from: "m.saghfary@aui.ma",
    to: toEmail,
    subject: "Your Order Has Been Approved ✅",
    html: `
      <!DOCTYPE html>
      <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Order Approval</title>
            <style>
                body {
                    font-family: 'Arial', sans-serif;
                    line-height: 1.6;
                    color: #333;
                    font-size: 16px;
                    margin: 20px;
                }

                h2 {
                    color: #28a745;
                }
            </style>
        </head>

        <body>
            <h2>✅ Your Order Has Been Approved!</h2>

            <p>Dear Customer,</p>

            <p>We’re happy to inform you that your order has been approved. Please reply to this email with your full name and address to confirm your order.</p>

            <p>Thank you for choosing Babily!</p>

            <p>Best regards, <br> The Babily Team</p>
        </body>
      </html>
    `,
  }, (err: any, info: SentMessageInfo) => {
    if (err) {
      console.error(err, "Error sending email");
      return;
    }

    console.info(`Preview URL: ${getTestMessageUrl(info)}`)
  });
}


export async function sendRejectionEmailService(toEmail: string) {
  console.log(toEmail)
  transporter.sendMail({
    from: "m.saghfary@aui.ma",
    to: toEmail,
    subject: "Your Order Request Cannot Be Fulfilled ❌",
    html: `
      <!DOCTYPE html>
      <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Order Rejection</title>
            <style>
                body {
                    font-family: 'Arial', sans-serif;
                    line-height: 1.6;
                    color: #333;
                    font-size: 16px;
                    margin: 20px;
                }

                h2 {
                    color: #dc3545;
                }
            </style>
        </head>

        <body>
            <h2>❌ We’re Unable to Fulfill Your Order</h2>

            <p>Dear Customer,</p>

            <p>Unfortunately, we are unable to approve your order at this time. Please contact our support team for more information.</p>

            <p>We appreciate your understanding and look forward to serving you in the future.</p>

            <p>Best regards, <br> The Babily Team</p>
        </body>
      </html>
    `,
  }, (err: any, info: SentMessageInfo) => {
    if (err) {
      console.error(err, "Error sending email");
      return;
    }

    console.info(`Preview URL: ${getTestMessageUrl(info)}`)
  });
}

export async function sendConfirmationEmailService(toEmail: string) {
  console.log(toEmail)
  transporter.sendMail({
    from: "m.saghfary@aui.ma",
    to: toEmail,
    subject: "Your Order Request Has Been Received 📦",
    html: `
      <!DOCTYPE html>
      <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Order Confirmation</title>
            <style>
                body {
                    font-family: 'Arial', sans-serif;
                    line-height: 1.6;
                    color: #333;
                    font-size: 16px;
                    margin: 20px;
                }

                h2 {
                    color: #007bff;
                }
            </style>
        </head>

        <body>
            <h2>📦 Order Request Received!</h2>

            <p>Dear Customer,</p>

            <p>Your order request has been successfully received. Our team will review your request and get back to you shortly.</p>

            <p>Thank you for choosing Babily. We’re excited to serve you!</p>

            <p>Best regards, <br> The Babily Team</p>
        </body>
      </html>
    `,
  }, (err: any, info: SentMessageInfo) => {
    if (err) {
      console.error(err, "Error sending email");
      return;
    }

    console.info(`Preview URL: ${getTestMessageUrl(info)}`)
  });
}