import api from "../../config/axios"; 


export const login = async (email, password) => {
  try {
    const res = await api.post("/auth/login", { email, password });
    if (res.data.data.token) {
      localStorage.setItem("auth_token", res.data.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.data.user));
    }
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "Login failed" };
  }
};

// Đăng xuất
export const logout = () => {
  localStorage.removeItem("auth_token");
  localStorage.removeItem("user");
};
