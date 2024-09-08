import React, { useCallback, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ContractDetails {
  name: string;
  symbol: string;
  type: "ERC721" | "HSCS";
}

export default function ContractPreview({
  contractDetails,
}: {
  contractDetails: ContractDetails;
}) {
  const [erc721Template, setERC721Template] = useState("");
  const [hscsTemplate, setHSCSTemplate] = useState("");

  const fetchERC721Template = useCallback(async () => {
    try {
      const response = await fetch(
        `/api/contract-template?name=${
          contractDetails.name || "MyNFT"
        }&symbol=${contractDetails.symbol || "NFT"}&type=ERC721`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.text();
      setERC721Template(data);
    } catch (error) {
      console.error("Failed to fetch ERC721 contract template:", error);
    }
  }, [contractDetails.name, contractDetails.symbol]);

  useEffect(() => {
    fetchERC721Template();

    // Set HSCS template
    setHSCSTemplate(`const { Client, TokenCreateTransaction, PrivateKey } = require("@hashgraph/sdk");
require("dotenv").config();

async function main() {
    const operatorId = process.env.MY_ACCOUNT_ID;
    const operatorKey = PrivateKey.fromString(process.env.MY_PRIVATE_KEY);

    const client = Client.forTestnet().setOperator(operatorId, operatorKey);

    const tokenCreateTx = await new TokenCreateTransaction()
        .setTokenName("${contractDetails.name}")
        .setTokenSymbol("${contractDetails.symbol}")
        .setTreasuryAccountId(operatorId)
        .setInitialSupply(1000000)
        .setDecimals(2)
        .execute(client);

    const receipt = await tokenCreateTx.getReceipt(client);
    const tokenId = receipt.tokenId;
    console.log(\`Created token with ID: \${tokenId}\`);
}

main();`);
  }, [fetchERC721Template, contractDetails.name, contractDetails.symbol]);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Smart Contract Preview</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={contractDetails.type} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="ERC721">ERC721 Preview</TabsTrigger>
            <TabsTrigger value="HSCS">HSCS Preview</TabsTrigger>
          </TabsList>
          <TabsContent value="ERC721">
            <pre className="font-mono text-sm h-[400px] bg-gray-100 p-4 rounded-md whitespace-pre-wrap overflow-hidden">
              {erc721Template}
            </pre>
          </TabsContent>
          <TabsContent value="HSCS">
            <pre className="font-mono text-sm h-[400px] bg-gray-100 p-4 rounded-md whitespace-pre-wrap overflow-hidden">
              {hscsTemplate}
            </pre>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
