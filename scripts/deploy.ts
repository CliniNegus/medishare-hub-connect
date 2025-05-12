
import { ethers } from "hardhat";

async function main() {
  console.log("Deploying DeviceLeasing contract...");

  const DeviceLeasing = await ethers.getContractFactory("DeviceLeasing");
  const deviceLeasing = await DeviceLeasing.deploy();

  await deviceLeasing.waitForDeployment();
  const address = await deviceLeasing.getAddress();

  console.log(`DeviceLeasing contract deployed to: ${address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
