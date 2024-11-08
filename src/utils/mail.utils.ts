import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
type SendEmailDto = {
  sender: Mail.Address;
  recipients: Mail.Address[];
  subject: string;
  message: string;
  html: string;
};
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
} as SMTPTransport.Options);

export const sendEmail = async (dto: SendEmailDto) => {
  const { sender, recipients, subject, message, html } = dto;
  return await transporter.sendMail({
    from: sender,
    to: recipients,
    subject: subject,
    text: message,
    html: html,
  });
};
