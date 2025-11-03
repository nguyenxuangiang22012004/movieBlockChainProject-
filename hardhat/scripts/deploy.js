import pkg from "hardhat";
const { ethers } = pkg;

async function main() {
  console.log("🚀 Deploying Subscription contract on Hardhat local network...");

  // ✅ Ethers v5 dùng ethers.utils.parseEther()
  const basicPrice = ethers.utils.parseEther("0.01");
  const premiumPrice = ethers.utils.parseEther("0.03");
  const cinematicPrice = ethers.utils.parseEther("0.05");

  const Subscription = await ethers.getContractFactory("Subscription");
  const subscription = await Subscription.deploy(basicPrice, premiumPrice, cinematicPrice);

  await subscription.deployed(); // ✅ Ethers v5 syntax
  console.log(`✅ Subscription deployed to: ${subscription.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
