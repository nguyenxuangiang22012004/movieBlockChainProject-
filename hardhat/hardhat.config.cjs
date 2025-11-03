require("dotenv").config();
require("@nomiclabs/hardhat-ethers");

const { RPC_URL, DEPLOY_PRIVATE_KEY } = process.env;

module.exports = {
  solidity: "0.8.19",
  networks: {
    hardhat: {},
    mumbai: {
      url: RPC_URL,
      accounts: [DEPLOY_PRIVATE_KEY],
    },
  },
};
