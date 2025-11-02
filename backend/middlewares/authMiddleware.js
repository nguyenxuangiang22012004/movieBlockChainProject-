import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const JWT_SECRET = process.env.JWT_SECRET ;

export const authMiddleware = async (req, res, next) => {
  try {
    // Lấy token từ header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Không tìm thấy token xác thực",
      });
    }

    const token = authHeader.substring(7); // Bỏ "Bearer "

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Tìm user
    const user = await User.findById(decoded.userId).select("-password");
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User không tồn tại",
      });
    }

    if (user.status === "banned") {
      return res.status(403).json({
        success: false,
        message: "Tài khoản đã bị khóa",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Token không hợp lệ",
      });
    }
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token đã hết hạn",
      });
    }
    return res.status(500).json({
      success: false,
      message: "Lỗi xác thực",
    });
  }
};

// Middleware kiểm tra role
export const requireRole = (...roles) => {
  return (req, res, next) => {
    console.log("🟢 Vào requireRole với roles:", roles);
    console.log("🔍 req.user:", req.user);
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Chưa đăng nhập",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Bạn không có quyền truy cập",
      });
    }
    next();
  };
};