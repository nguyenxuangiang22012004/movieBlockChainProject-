import express from "express";
import * as usersController from "../controllers/users/usersController.js";
const router = express.Router();

router.get("/", usersController.getAllUsers);


export default router;
