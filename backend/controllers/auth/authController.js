import { loginService, registerService ,verifyEmailService} from "../../services/auth/authService.js";

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
  try {
    const result = await registerService(req.body);
    return res.status(result.statusCode).json(result);
  } catch (error) {
    console.error("Register Controller Error:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi máy chủ, vui lòng thử lại sau",
    });
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


export const verifyEmailController = async (req, res) => {
  try {
    const { token } = req.query;
    const result = await verifyEmailService(token);

    // ✅ Trả về JSON để frontend tự redirect
    return res.status(result.statusCode).json(result);
  } catch (error) {
    console.error("Verify email controller error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi máy chủ nội bộ.",
    });
  }
};