// scripts/deploy.ts
import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const VaultStorage = await ethers.getContractFactory("VaultStorage");

  // Deploy contract and get deployment transaction
  const vaultStorage = await VaultStorage.deploy();
  const deploymentTx = vaultStorage.deploymentTransaction();

  if (deploymentTx) {
    console.log("Transaction hash:", deploymentTx.hash);
    console.log("Waiting for deployment confirmation...");
  }

  await vaultStorage.waitForDeployment();

  const contractAddress = await vaultStorage.getAddress();
  console.log("✅ Contract deployed to:", contractAddress);
}

main().catch((error) => {
  console.error("❌ Deployment error:", error);
  process.exitCode = 1;
});
