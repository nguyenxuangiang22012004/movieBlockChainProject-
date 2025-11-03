import api from "../config/axios.js";

export const updateSubscription = async (walletAddress) => {
  try {
    const response = await api.post("/subscription/update", { walletAddress });
    return response.data;
  } catch (error) {
    console.error("❌ Lỗi cập nhật subscription:", error.response?.data || error.message);
    throw error;
  }
};
