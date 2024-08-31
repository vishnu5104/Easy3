import { ethers } from "ethers";
import { readFileSync } from "fs";
import "dotenv/config";

const outputPath = "output-sepolia.json";
const output = JSON.parse(readFileSync(outputPath, "utf8"));

const { abi, address } = output;

const privateKey = process.env.PRIVATE_KEY;
if (!privateKey) {
  throw new Error("PRIVATE_KEY is not defined in the environment variables");
}

const sepoliaProvider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
const sepoliaWallet = new ethers.Wallet(privateKey, sepoliaProvider);

const contract = new ethers.Contract(address, abi, sepoliaWallet);

async function setBaseURI(newBaseURI: string) {
  console.log("Setting base URI...");

  try {
    const gasLimit = 25808;
    const tokencc = await contract.setBaseURI(newBaseURI);
    await tokencc.wait();
    console.log("done", tokencc);
  } catch (error) {
    console.error("Error setting base URI:", error);
  }
}

const newBaseURI =
  "https://gateway.pinata.cloud/ipfs/QmXhfdzgqkE6rxvM362iC17szLAgtBbRVezhcmuURF75YK";
setBaseURI(newBaseURI);
