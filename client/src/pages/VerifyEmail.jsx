// src/pages/VerifyEmail.jsx
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { verifyEmailService } from "../services/authService";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState("Đang xác minh email... ⏳");
  const token = searchParams.get("token");

  useEffect(() => {
    const handleVerify = async () => {
      try {
        await verifyEmailService(token);
        setMessage("✅ Xác minh email thành công! Bạn có thể đăng nhập ngay.");
      } catch {
        setMessage("❌ Token không hợp lệ hoặc đã hết hạn.");
      }
    };

    if (token) handleVerify();
  }, [token]);

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>{message}</h2>
      {message.includes("thành công") && (
        <a
          href="/login"
          style={{
            display: "inline-block",
            marginTop: "20px",
            background: "#007bff",
            color: "#fff",
            padding: "10px 20px",
            borderRadius: "6px",
            textDecoration: "none",
          }}
        >
          Đăng nhập ngay
        </a>
      )}
    </div>
  );
};

export default VerifyEmail;
