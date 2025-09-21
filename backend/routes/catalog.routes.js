import express from "express";
import * as catalogController from "../controllers/upload/catalogController.js";

const router = express.Router();

router.get("/catalog", catalogController.getCatalog);

router.get("/catalog/:id", catalogController.getCatalogItemById);

router.put("/catalog/:id", catalogController.updateCatalogItem);

router.patch("/:type/:id/status", catalogController.updateStatusCatalog);

router.delete("/catalog/:id", catalogController.deleteCatalogItem);

export default router;
