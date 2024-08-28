import { resolve, dirname } from "path";
import { writeFileSync, unlinkSync, readFileSync, existsSync } from "fs";
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
    const contractDir = "contracts";
    const filePath = resolve(process.cwd(), contractDir, `${contractName}.sol`);

    const fs = require("fs");
    if (!fs.existsSync(contractDir)) {
      fs.mkdirSync(contractDir, { recursive: true });
    }

    writeFileSync(filePath, contractContent);

    const { abi, bytecode } = compileContractWithImports(
      filePath,
      contractName
    );

    const outputData = { abi, bytecode, contractName };
    writeFileSync("output.json", JSON.stringify(outputData, null, 2));

    const privateKey = process.env.PRIVATE_KEY;
    const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
    const wallet = new ethers.Wallet(privateKey, provider);

    console.log("Deploying contract...");
    const factory = new ethers.ContractFactory(abi, bytecode, wallet);
    const endpoint = "0x6EDCE65403992e310A62460808c4b910D972f10f";
    const delegate = "0xa929ba7c88a260A50B02cf243cfd075Af83c70f6";
    const contractInstance = await factory.deploy(endpoint, delegate);

    await contractInstance.waitForDeployment();
    const contractaddress = await contractInstance.getAddress();
    console.log("Contract deployed to address:", contractaddress);

    unlinkSync(filePath);

    return new Response(JSON.stringify({ address: contractInstance.address }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error in contract deployment:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}

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
