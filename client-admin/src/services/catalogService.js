import api from "../config/axios";

export const catalogService = {
  deleteItem: (id) => api.delete(`/catalog/${id}`),
};
