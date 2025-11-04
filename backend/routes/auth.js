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
import passport from "passport";
import jwt from "jsonwebtoken";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/auth/login", loginController);
router.post("/auth/register", registerController);

router.get("/auth/profile", authMiddleware, getProfileController);
router.post("/auth/logout", authMiddleware, logoutController);

router.get("/auth/verify-email", verifyEmailController);

router.post("/auth/forgot-password", forgotPasswordController);
router.post("/auth/reset-password", resetPasswordController);

router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    const user = req.user;

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    res.send(`
      <script>
        window.opener.postMessage(
          {
            type: "google-auth-success",
            token: "${token}",
            user: ${JSON.stringify({
              _id: user._id,
              email: user.email,
              name: user.name,
              role: user.role,
              avatar: user.avatar || "",
            })}
          },
          "${frontendUrl}"
        );
        window.close();
      </script>
    `);
  }
);


export default router;