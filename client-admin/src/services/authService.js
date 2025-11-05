import api from "../../config/axios"; 


export const login = async (email, password) => {
  try {
    const response = await api.post("/auth/login", { email, password });
    console.log(response.data);
    if (!response.data) {
      throw new Error("Response không hợp lệ");
    }

    const { success, data, message } = response.data;
    
    if (!success) {
      throw new Error(message || "Đăng nhập thất bại");
    }

    // Kiểm tra có token và user không
    if (!data?.token || !data?.user) {
      throw new Error("Dữ liệu đăng nhập không đầy đủ");
    }

    if (data.user.role !== "admin") {
      throw new Error("Bạn không có quyền truy cập vào trang này");
    }

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

// Đăng xuất
export const logout = () => {
  localStorage.removeItem("auth_token");
  localStorage.removeItem("user");
};
