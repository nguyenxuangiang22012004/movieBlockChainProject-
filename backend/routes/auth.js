import express from "express";
import { 
  loginController, 
  registerController, 
  getProfileController,
  logoutController,verifyEmailController 
} from "../controllers/auth/authController.js";

import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/auth/login", loginController);
router.post("/auth/register", registerController);

router.get("/auth/profile", authMiddleware, getProfileController);
router.post("/auth/logout", authMiddleware, logoutController);

router.get("/auth/verify-email", verifyEmailController);
export default router;