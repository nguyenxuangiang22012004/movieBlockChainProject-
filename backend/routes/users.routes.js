import express from "express";
import * as usersController from "../controllers/users/usersController.js";
const router = express.Router();

router.get("/", usersController.getAllUsers);

router.get("/:id", usersController.getUserById);

router.post("/", usersController.createUser);

router.put("/:id", usersController.updateUser);
export default router;
