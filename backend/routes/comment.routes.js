// routes/comment.route.js
import express from "express";
import { createComment, getCommentsByItem } from "../controllers/commentController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js"; 

const router = express.Router();

// 🧩 Tạo bình luận — cần đăng nhập
router.post("/", authMiddleware, createComment);

// 🧩 Lấy danh sách bình luận theo item — công khai
router.get("/:itemId", getCommentsByItem);

export default router;