import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
type SendEmailDto = {
  sender: Mail.Address;
  receipients: Mail.Address[];
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
  const { sender, receipients, subject, message, html } = dto;
  return await transporter.sendMail({
    from: sender,
    to: receipients,
    subject: subject,
    text: message,
    html: html,
  });
};
