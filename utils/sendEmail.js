
const nodemailer = require("nodemailer");

// async..await is not allowed in global scope, must use a wrapper
const sendEmail = async (options) => {

  let testAccount = await nodemailer.createTestAccount();

  // TRANSPORTER THAT WILL BE USED TO FIND THE MAILBOX WE CREATED
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USERNAME,
      pass: process.env.SMTP_PASSWORD,
    }
  });

  // EMAIL WE WANT TO SEND
  const msg = {
    from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    text: options.text
  }
  // SEND THE EMAIL WITH USING THE TRASPORTER AND RETURN "info"
  const info = await transporter.sendMail(msg)

  console.log("Message sent: %s", info.messageId);
}

module.exports = sendEmail

