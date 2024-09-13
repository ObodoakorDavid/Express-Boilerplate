import nodemailer from "nodemailer";
import handlebars from "handlebars";
import fs from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import OTP from "../v1/models/otp.model.js";
import generateOTP from "../utils/generateOTP.js";
// import { formatDate } from "./dateUtils.js";

import env from "dotenv";
env.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const templatePath = join(__dirname, "..", "templates", "OTPTemplate.html");
const emailTemplateSource = fs.readFileSync(templatePath, "utf8");

const sendEmail = async ({ to, subject, text, html, from }) => {
  try {
    const transporter = nodemailer.createTransport({
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

    const mailOptions = {
      from: from || "Admin@BCT.com",
      to,
      subject,
      text,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

const sendOTPViaEmail = async (email, userName) => {
  await OTP.findOneAndDelete({ email });
  const otp = generateOTP();
  await OTP.create({ email, otp });
  const subject = "OTP Request";
  //   const date = formatDate(Date.now());
  const date = Date.now();
  const emailText = `Hello ${userName},\n\nYour OTP is: ${otp}`;
  const template = handlebars.compile(emailTemplateSource);
  const html = template({ userName, otp, date });

  return sendEmail({
    to: email,
    subject,
    text: emailText,
    html,
  });
};
export default {
  sendEmail,
  sendOTPViaEmail,
};
