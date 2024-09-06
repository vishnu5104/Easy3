import { resolve } from "path";
import { writeFileSync, readFileSync, existsSync, mkdirSync } from "fs";
import { ethers } from "ethers";
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
    const contractDir = "src/contracts";
    const filePath = resolve(process.cwd(), contractDir, `${contractName}.sol`);

    if (!existsSync(contractDir)) {
      mkdirSync(contractDir, { recursive: true });
    }

    writeFileSync(filePath, contractContent);

    const { abi, bytecode } = compileContractWithImports(
      filePath,
      contractName
    );

    return new Response(
      JSON.stringify({
        message: "Contract file created successfully.",
        abi,
        bytecode,
      }),
      { status: 200 }
    );
  } catch (error) {
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
