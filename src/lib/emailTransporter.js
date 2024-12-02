import nodemailer from "nodemailer";
import env from "dotenv";

env.config();

const createTransporter = () =>
  nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    auth: {
      user: process.env.BREVO_EMAIL,
      pass: process.env.BREVO_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

export default createTransporter;
