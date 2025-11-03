// services/blockchain/subscriptionService.js
import { ethers } from "ethers";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const abiPath = path.resolve(__dirname, "../../../hardhat/artifacts/contracts/SubscriptionPay.sol/Subscription.json");
const SubscriptionABI = JSON.parse(fs.readFileSync(abiPath, "utf-8")).abi;

const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545");

export const getUserSubscription = async (walletAddress) => {
  const contract = new ethers.Contract(CONTRACT_ADDRESS, SubscriptionABI, provider);
  const [active, expiresAt, plan] = await contract.getSubscription(walletAddress);
  return {
    active,
    expiresAt: Number(expiresAt),
    plan: Number(plan),
  };
};
