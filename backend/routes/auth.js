import express from "express";
import { 
  loginController, 
  registerController, 
  getProfileController,
  logoutController,
  verifyEmailController,
  forgotPasswordController,
  resetPasswordController
} from "../controllers/auth/authController.js";

import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/auth/login", loginController);
router.post("/auth/register", registerController);

router.get("/auth/profile", authMiddleware, getProfileController);
router.post("/auth/logout", authMiddleware, logoutController);

router.get("/auth/verify-email", verifyEmailController);

router.post("/auth/forgot-password", forgotPasswordController);
router.post("/auth/reset-password", resetPasswordController);
export default router;