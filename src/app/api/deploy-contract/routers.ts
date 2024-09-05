import { resolve } from "path";
import {
  writeFileSync,
  unlinkSync,
  readFileSync,
  existsSync,
  mkdirSync,
} from "fs";
import { ethers } from "ethers";
import "dotenv/config";
const solc = require("solc");

export async function POST(req: Request) {
  const { contractName, contractContent } = await req.json();

  if (!contractName || !contractContent) {
    return new Response(
      JSON.stringify({ error: "Contract name and content are required" }),
      { status: 400 }
    );
  }

  try {
    // Change the directory to be inside src folder
    const contractDir = "src/contracts";
    const filePath = resolve(process.cwd(), contractDir, `${contractName}.sol`);

    console.log(`Creating contracts directory at: ${contractDir}`);
    if (!existsSync(contractDir)) {
      mkdirSync(contractDir, { recursive: true });
      console.log("Contracts directory created.");
    } else {
      console.log("Contracts directory already exists.");
    }

    console.log(`Writing contract to file: ${filePath}`);
    writeFileSync(filePath, contractContent);
    console.log("Contract file written successfully.");

    const { abi, bytecode } = compileContractWithImports(
      filePath,
      contractName
    );

    const privateKey = process.env.PRIVATE_KEY;

    const hederaProvider = new ethers.JsonRpcProvider(
      process.env.Hedera_RPC_URL
    );

    const wallet = new ethers.Wallet(privateKey);

    const contractAddress = await deployContract(
      "Hedera Testnet",
      wallet.connect(hederaProvider),
      abi,
      bytecode
    );

    // Clean up the file because Easy don't store the contract file
    // unlinkSync(filePath);
    // console.log(`Contract file ${filePath} deleted.`);

    return new Response(
      JSON.stringify({
        message: "Contract deployed successfully.",
        contractAddress: contractAddress,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in contract deployment:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}

const deployContract = async (
  networkName: string,
  wallet: ethers.Wallet,
  abi: any,
  bytecode: string
): Promise<string> => {
  console.log(`Deploying contract to ${networkName}...`);

  const factory = new ethers.ContractFactory(abi, bytecode, wallet);

  const endpoint = "0xbD672D1562Dd32C23B563C989d8140122483631d";
  const delegate = "0x0C467c60e97221de6cD9C93C3AF1861f7aE2995C";

  const contractInstance = await factory.deploy(endpoint, delegate);

  await contractInstance.waitForDeployment();

  const address = await contractInstance.getAddress();
  console.log(`Contract deployed to address on ${networkName}:`, address);

  const output = {
    abi,
    address,
    network: networkName,
  };

  writeFileSync(`output-${networkName}.json`, JSON.stringify(output, null, 2));
  console.log(`Output written to output-${networkName}.json`);

  return address;
};

const compileContractWithImports = (
  baseContractPath: string,
  contractName: string
) => {
  const sources: { [key: string]: { content: string } } = {};
  sources[contractName + ".sol"] = {
    content: readFileSync(baseContractPath, "utf8"),
  };

  const input = {
    language: "Solidity",
    sources: sources,
    settings: {
      outputSelection: {
        "*": {
          "*": ["*"],
        },
      },
    },
  };

  const output = JSON.parse(
    solc.compile(JSON.stringify(input), { import: findImports })
  );

  if (output.errors) {
    output.errors.forEach((error: any) => {
      console.error(error.formattedMessage);
    });
    throw new Error("Solidity compilation failed");
  }

  if (
    !output.contracts[contractName + ".sol"] ||
    !output.contracts[contractName + ".sol"][contractName]
  ) {
    throw new Error(
      `Contract '${contractName}' not found in compilation output`
    );
  }

  const bytecode =
    "0x" +
    output.contracts[contractName + ".sol"][contractName].evm.bytecode.object;
  const abi = output.contracts[contractName + ".sol"][contractName].abi;

  return { bytecode, abi };
};

const findImports = (importPath: string) => {
  let resolvedPath = resolve(importPath);

  if (!existsSync(resolvedPath)) {
    resolvedPath = resolve("node_modules", importPath);
  }

  if (existsSync(resolvedPath)) {
    return { contents: readFileSync(resolvedPath, "utf8") };
  } else {
    return { error: `File not found: ${importPath}` };
  }
};
