import api from "../config/axios";

export const postComment = async (itemId, itemType, content, parentCommentId = null) => {
  try {
    const res = await api.post("/comments", {
      item_id: itemId,
      item_type: itemType,
      content,
      parent_comment_id: parentCommentId,
    });
    return res;
  } catch (error) {
    console.error("❌ postComment error:", error.response?.data || error.message);
    throw error;
  }
};

export const getComments = async (itemId) => {
  try {
    const res = await api.get(`/comments/${itemId}`);
    return res;
  } catch (error) {
    console.error("❌ getComments error:", error.response?.data || error.message);
    throw error;
  }
};