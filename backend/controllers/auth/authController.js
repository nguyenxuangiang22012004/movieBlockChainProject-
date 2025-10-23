import { loginService, registerService ,verifyEmailService ,resetPasswordService , forgotPasswordService} from "../../services/auth/authService.js";

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const result = await loginService(email, password);
    
    return res.status(result.statusCode).json(result);
  } catch (error) {
    console.error("Login Controller Error:", error);
    return res.status(500).json({
      success: false,
      statusCode: 500,
      message: "Lỗi máy chủ, vui lòng thử lại sau",
    });
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


export const forgotPasswordController = async (req, res) => {
  try {
    const { email } = req.body;
    const result = await forgotPasswordService(email);
    
    return res.status(result.statusCode).json(result);
  } catch (error) {
    console.error("Forgot password controller error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi máy chủ, vui lòng thử lại sau",
    });
  }
};

// Reset Password Controller
export const resetPasswordController = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    const result = await resetPasswordService(token, newPassword);
    
    return res.status(result.statusCode).json(result);
  } catch (error) {
    console.error("Reset password controller error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi máy chủ, vui lòng thử lại sau",
    });
  }
};