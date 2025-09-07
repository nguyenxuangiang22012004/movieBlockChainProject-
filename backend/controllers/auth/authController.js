import { loginService } from "../../services/auth/authService.js";

export const loginController = async (req, res) => {
  const { email, password } = req.body;
  const result = await loginService(email, password);
  if (result.success) {
    res.json(result);
  } else {
    res.status(401).json(result);
  }
};