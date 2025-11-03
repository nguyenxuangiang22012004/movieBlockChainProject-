import api from "../config/axios";

// Đăng nhập
export const login = async (email, password) => {
  try {
    const response = await api.post("/auth/login", { email, password });

    // Kiểm tra response có đúng cấu trúc không
    if (!response.data) {
      throw new Error("Response không hợp lệ");
    }

    const { success, data, message } = response;
    
    if (!success) {
      throw new Error(message || "Đăng nhập thất bại");
    }

    // Kiểm tra có token và user không
    if (!data?.token || !data?.user) {
      throw new Error("Dữ liệu đăng nhập không đầy đủ");
    }

    // Kiểm tra role - chỉ cho phép user role
    if (data.user.role !== "user") {
      throw new Error("Bạn không có quyền truy cập vào trang này");
    }

    // Lưu token và thông tin user vào localStorage
    localStorage.setItem("auth_token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    return {
      success: true,
      message: message || "Đăng nhập thành công",
      data: {
        token: data.token,
        user: data.user,
      },
    };
  } catch (err) {
    // Xóa thông tin cũ nếu đăng nhập thất bại
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");

    // Xử lý error message
    const errorMessage = 
      err.response?.data?.message || 
      err.message || 
      "Đăng nhập thất bại. Vui lòng thử lại";

    throw new Error(errorMessage);
  }
};

// Đăng ký
export const register = async (userData) => {
  try {
    const { data } = await api.post("/auth/register", userData);
    return data;
  } catch (err) {
    throw err.response?.data || { message: "Đăng ký thất bại" };
  }
};


// Đăng xuất
export const logout = async () => {
  try {
    // Gọi API logout để xử lý ở backend (nếu cần)
    const token = localStorage.getItem("auth_token");
    if (token) {
      await api.post("/auth/logout");
    }
  } catch (err) {
    console.error("Logout error:", err);
  } finally {
    // Luôn xóa token và user info khỏi localStorage
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
  }
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


export const forgotPassword = async (email) => {
  try {
    const response = await api.post("/auth/forgot-password", { email });
  
    if (!response) {
      throw new Error("Response không hợp lệ");
    }

    const { success, message } = response;

    if (!success) {
      throw new Error(message || "Gửi email thất bại");
    }

    return {
      success: true,
      message: message || "Email đặt lại mật khẩu đã được gửi",
    };
  } catch (err) {
    const errorMessage = 
      err.response?.data?.message || 
      err.message || 
      "Gửi email thất bại. Vui lòng thử lại";

    throw new Error(errorMessage);
  }
};

// Reset mật khẩu - Đặt mật khẩu mới
export const resetPassword = async (token, newPassword) => {
  try {
    const response = await api.post("/auth/reset-password", { 
      token, 
      newPassword 
    });

    if (!response) {
      throw new Error("Response không hợp lệ");
    }

    const { success, message } = response;

    if (!success) {
      throw new Error(message || "Đặt lại mật khẩu thất bại");
    }

    return {
      success: true,
      message: message || "Đặt lại mật khẩu thành công",
    };
  } catch (err) {
    const errorMessage = 
      err.response?.data?.message || 
      err.message || 
      "Đặt lại mật khẩu thất bại. Vui lòng thử lại";

    throw new Error(errorMessage);
  }
};