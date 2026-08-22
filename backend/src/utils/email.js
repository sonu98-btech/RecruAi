import nodemailer from "nodemailer";
import env from "../config/env.js";
import { logger } from "./logger.js";

function createTransport() {
  if (!env.smtp.host) {
    return null;
  }

  return nodemailer.createTransport({
    host: env.smtp.host,
    port: env.smtp.port,
    secure: env.smtp.port === 465,
    auth: env.smtp.user
      ? {
          user: env.smtp.user,
          pass: env.smtp.pass,
        }
      : undefined,
  });
}

const transporter = createTransport();

export async function sendMail({ to, subject, html, text }) {
  if (!transporter) {
    logger.info("Email skipped (SMTP not configured)", { to, subject });
    return { skipped: true };
  }

  await transporter.sendMail({
    from: env.smtp.from,
    to,
    subject,
    html,
    text,
  });

  return { skipped: false };
}
