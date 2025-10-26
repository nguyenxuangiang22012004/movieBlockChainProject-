import api from "../../config/axios";


export const getAllUsers = async (params = {}) => {
  try {
    const res = await api.get("/users", { params }); 
    return res.data;
  } catch (err) {
    console.error("❌ getAllUsers error:", err);
    throw err.response?.data || { message: "Không thể tải danh sách người dùng" };
  }
};