import express from "express";
import * as usersController from "../controllers/users/usersController.js";
const router = express.Router();
console.log("🧭 users.routes.js được load");

router.get("/", usersController.getAllUsers);

router.get("/:id", usersController.getUserById);

router.post("/", usersController.createUser);

router.put("/:id", usersController.updateUser);

router.delete("/:id", usersController.deleteUser); 

router.patch("/:id/status", usersController.updateUserStatus);


export default router;
