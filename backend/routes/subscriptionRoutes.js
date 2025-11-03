import express from "express";
import { getSubscription ,updateSubscriptionStatus } from "../controllers/subscriptionController.js";

const router = express.Router();

router.get("/:wallet", getSubscription);

router.post("/update", updateSubscriptionStatus);


export default router;
