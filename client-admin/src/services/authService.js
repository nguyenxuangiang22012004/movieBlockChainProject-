import api from "../../config/axios"; 

// Đăng nhập
export const login = async (email, password) => {
  try {
    const res = await api.post("/auth/login", { email, password });
    // lưu token vào localStorage
    if (res.data.token) {
      localStorage.setItem("auth_token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
    }
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "Login failed" };
  }
};

// Đăng ký
export const register = async (userData) => {
  try {
    const res = await api.post("/auth/register", userData);
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "Register failed" };
  }
};

// Lấy thông tin user hiện tại (dựa trên token)
export const getProfile = async () => {
  try {
    const res = await api.get("/auth/profile");
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "Get profile failed" };
  }
};

// Đăng xuất
export const logout = () => {
  localStorage.removeItem("auth_token");
  localStorage.removeItem("user");
};
