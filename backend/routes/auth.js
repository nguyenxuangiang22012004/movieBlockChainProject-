import express from "express";
import { loginController } from "../controllers/auth/authController.js";
const router = express.Router();


router.post("/auth/login", loginController);

export default router;
