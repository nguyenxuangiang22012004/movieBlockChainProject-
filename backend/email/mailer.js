import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config(); // ✅ Load .env trước

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  family: 4, // IPv4
  tls: {
    rejectUnauthorized: false,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Lỗi kết nối SMTP:", error);
  } else {
    console.log("✅ Kết nối Gmail SMTP thành công!");
  }
});

export default transporter;