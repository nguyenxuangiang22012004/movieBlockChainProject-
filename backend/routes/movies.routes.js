import express from "express";
import * as uploadController from "../controllers/upload/uploadMovieController.js";

const router = express.Router();

router.post("/movies", uploadController.createMovie);

router.get("/movies", uploadController.getMovie);
export default router;