import { getAllUsersService ,createUserService  } from "../../services/users/userService.js";
import bcrypt from "bcryptjs";


export const getAllUsers = async (req, res) => {
  try {
    const filters = req.query;
    const result = await getAllUsersService(filters);

    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (err) {
    console.error("❌ Error in getAllUsers:", err);
    return res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy danh sách người dùng",
      error: err.message,
    });
  }
};

export const createUser = async (req, res) => {
  try {
    const { email, username, password } = req.body;

    // 🔍 Kiểm tra dữ liệu đầu vào
    if (!email || !username || !password) {
      return res.status(400).json({
        success: false,
        message: "Thiếu email, username hoặc password",
      });
    }

    // 🧂 Mã hoá mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // 🚀 Gọi service tạo user
    const newUser = await createUserService({
      email,
      username,
      password: hashedPassword,
    });

    return res.status(201).json({
      success: true,
      message: "Tạo người dùng thành công",
      data: newUser,
    });
  } catch (err) {
    console.error("❌ Error in createUser:", err);

    // ⚠️ Nếu trùng email hoặc username
    if (err.code === 11000) {
      const field = Object.keys(err.keyValue)[0];
      return res.status(400).json({
        success: false,
        message: `Giá trị ${field} "${err.keyValue[field]}" đã tồn tại`,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Lỗi server khi tạo người dùng",
      error: err.message,
    });
  }
};