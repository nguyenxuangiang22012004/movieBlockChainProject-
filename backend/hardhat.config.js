import dotenv from "dotenv";
import "@nomiclabs/hardhat-ethers";

dotenv.config();

const { RPC_URL, DEPLOY_PRIVATE_KEY } = process.env;

const config = {
  solidity: "0.8.19",
  networks: {
    hardhat: {},
    mumbai: {
      url: RPC_URL || "",
      accounts: DEPLOY_PRIVATE_KEY ? [DEPLOY_PRIVATE_KEY] : [],
    },
  },
};

export default config;
