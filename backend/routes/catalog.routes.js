import express from "express";
import * as catalogController from "../controllers/upload/catalogController.js";

const router = express.Router();

router.get("/catalog", catalogController.getCatalog);

router.patch("/:type/:id/status", catalogController.updateStatusCatalog);
export default router;
