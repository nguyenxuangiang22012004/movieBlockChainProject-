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

// Đăng xuất
export const logout = () => {
  localStorage.removeItem("auth_token");
  localStorage.removeItem("user");
};

export const verifyEmailService = async (token) => {
  try {
    const res = await api.get(`/auth/verify-email?token=${token}`);

    if (res.data.success) {
      window.location.href = `${import.meta.env.VITE_CLIENT_URL}/login?verified=true`;
    } else {
      console.error(res.data.message);
    }
  } catch (error) {
    console.error("API Error:", error.response?.data || error);
  }
};