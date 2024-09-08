"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { PlusCircle, X } from "lucide-react";

interface ContractDetails {
  name: string;
  symbol: string;
  type: "ERC721" | "HSCS";
}

interface TokenParams {
  initialSupply: string;
  decimals: string;
  [key: string]: string;
}

export default function ContractPreview({
  contractDetails,
}: {
  contractDetails: ContractDetails;
}) {
  const [erc721Template, setERC721Template] = useState("");
  const [hscsTemplate, setHSCSTemplate] = useState("");
  const [tokenParams, setTokenParams] = useState<TokenParams>({
    initialSupply: "1000000",
    decimals: "2",
  });
  const [customFields, setCustomFields] = useState<string[]>([]);
  const [newCustomField, setNewCustomField] = useState("");

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
    updateHSCSTemplate();
  }, [fetchERC721Template, contractDetails, tokenParams, customFields]);

  const updateHSCSTemplate = () => {
    const customFieldsCode = customFields
      .map((field) => `.set${field}(${tokenParams[field] || "''"})`)
      .join("\n        ");

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
        .setInitialSupply(${tokenParams.initialSupply})
        .setDecimals(${tokenParams.decimals})
        ${customFieldsCode}
        .execute(client);

    const receipt = await tokenCreateTx.getReceipt(client);
    const tokenId = receipt.tokenId;
    console.log(\`Created token with ID: \${tokenId}\`);
}

main();`);
  };

  const handleParamChange = (key: string, value: string) => {
    setTokenParams((prev) => ({ ...prev, [key]: value }));
  };

  const handleAddCustomField = () => {
    if (newCustomField && !customFields.includes(newCustomField)) {
      setCustomFields((prev) => [...prev, newCustomField]);
      setTokenParams((prev) => ({ ...prev, [newCustomField]: "" }));
      setNewCustomField("");
    }
  };

  const handleRemoveCustomField = (field: string) => {
    setCustomFields((prev) => prev.filter((f) => f !== field));
    setTokenParams((prev) => {
      const { [field]: _, ...rest } = prev;
      return rest;
    });
  };

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
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <Label htmlFor="initialSupply">Initial Supply</Label>
                <Input
                  id="initialSupply"
                  value={tokenParams.initialSupply}
                  onChange={(e) =>
                    handleParamChange("initialSupply", e.target.value)
                  }
                />
              </div>
              <div>
                <Label htmlFor="decimals">Decimals</Label>
                <Input
                  id="decimals"
                  value={tokenParams.decimals}
                  onChange={(e) =>
                    handleParamChange("decimals", e.target.value)
                  }
                />
              </div>
              {customFields.map((field) => (
                <div key={field} className="flex items-center space-x-2">
                  <Label htmlFor={field}>{field}</Label>
                  <Input
                    id={field}
                    value={tokenParams[field]}
                    onChange={(e) => handleParamChange(field, e.target.value)}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveCustomField(field)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            <div className="flex items-center space-x-2 mb-4">
              <Input
                placeholder="Add custom field"
                value={newCustomField}
                onChange={(e) => setNewCustomField(e.target.value)}
              />
              <Button onClick={handleAddCustomField}>
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Field
              </Button>
            </div>
            <pre className="font-mono text-sm h-[400px] bg-gray-100 p-4 rounded-md whitespace-pre-wrap overflow-hidden">
              {hscsTemplate}
            </pre>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
