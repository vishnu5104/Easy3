import fs from "fs";
import path from "path";

export const getContractTemplate = (name: string, symbol: string) => {
  const filePath = path.join(process.cwd(), "contracts/ONFT721Template.sol");
  let template = fs.readFileSync(filePath, "utf8");
  return template.replace(/MyNFT/g, name).replace(/MYT/g, symbol);
};
