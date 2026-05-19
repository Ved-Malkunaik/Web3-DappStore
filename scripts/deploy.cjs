const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // Deploy DAppNFT
  const DAppNFT = await hre.ethers.getContractFactory("DAppNFT");
  const dAppNFT = await DAppNFT.deploy(deployer.address);
  await dAppNFT.waitForDeployment();
  const nftAddress = await dAppNFT.getAddress();
  console.log("DAppNFT deployed to:", nftAddress);

  // Deploy DAppStore
  const DAppStore = await hre.ethers.getContractFactory("DAppStore");
  const dAppStore = await DAppStore.deploy(nftAddress);
  await dAppStore.waitForDeployment();
  const storeAddress = await dAppStore.getAddress();
  console.log("DAppStore deployed to:", storeAddress);

  console.log("\nDeployment finished!");
  console.log("-------------------");
  console.log("DAppNFT:", nftAddress);
  console.log("DAppStore:", storeAddress);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
