import { loginService, registerService } from "../../services/auth/authService.js";

export const loginController = async (req, res) => {
  const { email, password } = req.body;
  const result = await loginService(email, password);
  if (result.success) {
    res.json(result);
  } else {
    res.status(401).json(result);
  }
};

export const registerController = async (req, res) => {
  const result = await registerService(req.body);
  
  if (result.success) {
    res.status(201).json(result);
  } else {
    res.status(400).json(result);
  }
};

export const getProfileController = async (req, res) => {
  try {
    res.json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy thông tin user",
    });
  }
};

export const logoutController = async (req, res) => {
  // Với JWT, logout chủ yếu xử lý ở client side
  // Server có thể thêm token vào blacklist nếu cần
  res.json({
    success: true,
    message: "Đăng xuất thành công",
  });
};