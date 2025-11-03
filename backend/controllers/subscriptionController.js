import { getUserSubscription } from "../services/blockchain/subscriptionService.js";
import { updateUserSubscription } from "../services/blockchain/subscriptionUpdateService.js";

export const getSubscription = async (req, res) => {
  try {
    const { wallet } = req.params;
    if (!wallet) return res.status(400).json({ error: "Missing wallet address" });

    const sub = await getUserSubscription(wallet);
    res.json(sub);
  } catch (err) {
    console.error("Error fetching subscription:", err);
    res.status(500).json({ error: "Failed to fetch subscription" });
  }
};

export const updateSubscriptionStatus = async (req, res) => {
  try {
    const { walletAddress } = req.body;

    const subscription = await updateUserSubscription(walletAddress);

    res.json({
      message: "Subscription status updated successfully",
      subscription,
    });
  } catch (err) {
    console.error("Error updating subscription:", err);
    const statusCode = err.message.includes("not found") ? 404 : 400;
    res.status(statusCode).json({ message: err.message });
  }
};