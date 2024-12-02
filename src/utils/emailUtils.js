import fs from "fs";
import path from "path";
import handlebars from "handlebars";
import OTP from "../v1/models/otp.model.js";
import generateOTP from "../utils/generateOTP.js";
import createTransporter from "../lib/emailTransporter.js";
import { fileURLToPath } from "url";
import { dirname } from "path";

// Get the directory name from import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class EmailUtils {
  constructor({
    emailTemplatePath = path.join(
      __dirname,
      "..",
      "templates",
      "OTPTemplate.html"
    ),
    defaultSender = "Admin@BCT.com",
  } = {}) {
    this.emailTemplatePath = emailTemplatePath;
    this.transporter = createTransporter();
    this.defaultSender = defaultSender;
    this.emailTemplateSource = fs.readFileSync(this.emailTemplatePath, "utf8");
    this.template = handlebars.compile(this.emailTemplateSource);
  }

  async sendEmail({ to, subject, text, html, from }) {
    try {
      const mailOptions = {
        from: from || this.defaultSender,
        to,
        subject,
        text,
        html,
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log("Email sent:", info.response);
      return info;
    } catch (error) {
      console.error("Error sending email:", error);
      throw error;
    }
  }

  async sendOTP(email, userName) {
    try {
      await OTP.findOneAndDelete({ email });
      const otp = generateOTP();
      await OTP.create({ email, otp });

      const subject = "OTP Request";
      const date = new Date().toLocaleString();
      const emailText = `Hello ${userName},\n\nYour OTP is: ${otp}`;
      const html = this.template({ userName, otp, date });

      return this.sendEmail({
        to: email,
        subject,
        text: emailText,
        html,
      });
    } catch (error) {
      console.error("Error sending OTP:", error);
      throw error;
    }
  }
}

export default new EmailUtils();
