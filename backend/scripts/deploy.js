async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying by:", deployer.address);

  // set initial prices (wei). ví dụ: 0 => free, 34.99 USD tùy chain => cho demo dùng wei numbers
  const basicPrice = ethers.utils.parseEther("0.0"); // Basic free
  const premiumPrice = ethers.utils.parseEther("0.01"); // ví dụ 0.01 MATIC
  const cinematicPrice = ethers.utils.parseEther("0.02");

  const Sub = await ethers.getContractFactory("Subscription");
  const sub = await Sub.deploy(basicPrice, premiumPrice, cinematicPrice);
  await sub.deployed();

  console.log("Subscription deployed to:", sub.address);
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
