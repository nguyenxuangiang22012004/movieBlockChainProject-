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

export const createUser = async (userData) => {
  try {
    const res = await api.post("/users", userData);
    return res.data;
  } catch (err) {
    console.error("❌ createUser error:", err);
    throw err;
  }
};

// ✅ Lấy chi tiết 1 user theo ID
export const getUserByIdService = async (userId) => {
  const res = await api.get(`/users/${userId}`);
  return res.data;
};

// ✅ Cập nhật user
export const updateUserService = async (userId, data) => {
  const res = await api.put(`/users/${userId}`, data);
  
  return res.data;
};

export const deleteUserService = async (id) => {
  const res = await api.delete(`/users/${id}`);
  return res.data;
};

export const updateUserStatusService = async (userId, newStatus) => {
  try {
    const res = await api.patch(`/users/${userId}/status`, {
      status: newStatus, 
    });

    return res.data;
  } catch (err) {
    console.error("❌ updateUserStatusService error:", err);
    throw err;
  }
};
