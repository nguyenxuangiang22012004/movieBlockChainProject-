import api from "../../config/axios"; 

export const getAllComments = async (page = 1, limit = 10, search = "") => {
  const response = await api.get("/comments", {
    params: { page, limit, search },
  });
  return response.data;
};