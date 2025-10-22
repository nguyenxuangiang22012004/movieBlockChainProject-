import api from "../config/axios";

// Đăng nhập
export const login = async (email, password) => {
  try {
    const res = await api.post("/auth/login", { email, password });
    
    if (res.data.success && res.data.token) {
      // Kiểm tra role - chỉ cho phép user đăng nhập
      if (res.data.user.role !== "user") {
        throw {
          message: "Bạn không có quyền truy cập vào trang này"
        };
      }

      // Lưu token và thông tin user vào localStorage
      localStorage.setItem("auth_token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
    }
    
    return res.data;
  } catch (err) {
    // Xóa thông tin cũ nếu đăng nhập thất bại
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
    
    throw err.response?.data || err || { message: "Đăng nhập thất bại" };
  }
};

// Đăng ký
export const register = async (userData) => {
  try {
    const { data } = await api.post("/auth/register", userData);

    if (data.success) {
      localStorage.setItem("auth_token", data.data.token);
      localStorage.setItem("user", JSON.stringify(data.data.user));
    }

    return data;
  } catch (err) {
    throw err.response?.data || { message: "Đăng ký thất bại" };
  }
};

// Lấy thông tin user hiện tại
export const getProfile = async () => {
  try {
    const res = await api.get("/auth/profile");
    
    // Cập nhật thông tin user trong localStorage
    if (res.data.success && res.data.user) {
      localStorage.setItem("user", JSON.stringify(res.data.user));
    }
    
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "Lấy thông tin thất bại" };
  }
};

// Đăng xuất
export const logout = () => {
  localStorage.removeItem("auth_token");
  localStorage.removeItem("user");
};

// Kiểm tra đã đăng nhập chưa
export const isAuthenticated = () => {
  return !!localStorage.getItem("auth_token");
};

// Lấy thông tin user từ localStorage
export const getCurrentUser = () => {
  const userStr = localStorage.getItem("user");
  return userStr ? JSON.parse(userStr) : null;
};

// Kiểm tra role user
export const checkUserRole = () => {
  const user = getCurrentUser();
  return user && user.role === "user";
};