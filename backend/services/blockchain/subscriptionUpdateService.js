// services/subscriptionUpdateService.js
import User from "../../models/user.model.js";
import { getUserSubscription } from "../blockchain/subscriptionService.js";

const PLAN_NAMES = ["Basic", "Premium", "Cinematic"];

export const updateUserSubscription = async (walletAddress) => {
  if (!walletAddress) {
    throw new Error("walletAddress is required");
  }

  // Lấy dữ liệu thật từ smart contract
  const sub = await getUserSubscription(walletAddress);

  // Tìm user trong DB
  const user = await User.findOne({ walletAddress });
  if (!user) {
    throw new Error("User not found with this wallet");
  }

  // Cập nhật cache trong DB
  user.subscriptionCache = {
    isActive: sub.active,
    planName: PLAN_NAMES[sub.plan] || null,
    expiresAt: sub.expiresAt ? new Date(sub.expiresAt * 1000) : null,
  };

  await user.save();

  return user.subscriptionCache;
};
