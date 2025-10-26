import { getAllUsersService } from "../../services/users/userService.js";

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