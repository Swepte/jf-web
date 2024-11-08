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
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: false, // true for port 465, false for other ports
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
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
