// controllers/comment.controller.js
import Comment from "../models/comment.model.js";

/**
 * @desc  Tạo bình luận mới
 * @route POST /api/comments
 * @access Private
 */
export const createComment = async (req, res) => {
  try {
    const { item_id, item_type, content, parent_comment_id } = req.body;

    if (!item_id || !item_type || !content) {
      return res.status(400).json({
        success: false,
        message: "Thiếu dữ liệu bắt buộc (item_id, item_type, content).",
      });
    }

    // ✅ user lấy từ middleware
    const user_id = req.user._id;

    const newComment = await Comment.create({
      user_id,
      item_id,
      item_type,
      content,
      parent_comment_id: parent_comment_id || null,
    });

    res.status(201).json({
      success: true,
      message: "Bình luận thành công.",
      comment: newComment,
    });
  } catch (error) {
    console.error("❌ Lỗi khi tạo bình luận:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server, không thể tạo bình luận.",
    });
  }
};

/**
 * @desc  Lấy danh sách bình luận theo item
 * @route GET /api/comments/:itemId
 * @access Public
 */
export const getCommentsByItem = async (req, res) => {
  try {
    const { itemId } = req.params;

    const comments = await Comment.find({ item_id: itemId })
      .populate("user_id", "username avatar") 
      .populate("parent_comment_id", "content user_id")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      total: comments.length,
      comments,
    });
  } catch (error) {
    console.error("❌ Lỗi khi lấy bình luận:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server, không thể lấy bình luận.",
    });
  }
};
