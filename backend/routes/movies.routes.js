import express from "express";
import * as uploadController from "../controllers/upload/uploadMovieController.js";

const router = express.Router();

// POST /api/movies - tạo một phim mới
router.post("/movies", uploadController.createMovie);

// GET /api/movies - lấy danh sách phim
router.get("/movies", uploadController.getMovie);
export default router;