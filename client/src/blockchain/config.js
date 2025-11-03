export const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;
export const RPC_URL = "http://127.0.0.1:8545";
export const CONTRACT_ABI = [
  {
    "inputs": [
      { "internalType": "uint256", "name": "basicPrice", "type": "uint256" },
      { "internalType": "uint256", "name": "premiumPrice", "type": "uint256" },
      { "internalType": "uint256", "name": "cinematicPrice", "type": "uint256" }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [
      { "internalType": "enum Subscription.Plan", "name": "plan", "type": "uint8" },
      { "internalType": "uint256", "name": "months", "type": "uint256" }
    ],
    "name": "buyPlan",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getSubscription",
    "outputs": [
      { "internalType": "bool", "name": "active", "type": "bool" },
      { "internalType": "uint256", "name": "expiresAt", "type": "uint256" },
      { "internalType": "enum Subscription.Plan", "name": "plan", "type": "uint8" }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];
