import React, { useState } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2 } from "lucide-react";

interface ContractDetails {
  name: string;
  symbol: string;
  totalSupply: number;
}
const ContractGenerator = ({
  contractDetails,
  onDeploy,
  onNext,
  onPrev,
}: {
  contractDetails: ContractDetails;
  onDeploy: (address: string) => void;
  onNext: () => void;
  onPrev: () => void;
}) => {
  const [fileCreated, setFileCreated] = useState<boolean | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const generateContractContent = () => {
    return `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import {ONFT721} from "@layerzerolabs/onft-evm/contracts/onft721/ONFT721.sol";

contract ${contractDetails.name} is ONFT721 {
    constructor(
        address _lzEndpoint,
        address _delegate 
    ) ONFT721("${contractDetails.name}","${contractDetails.symbol}" , _lzEndpoint, _delegate) {}
}`;
  };

  const handleCreateFile = async () => {
    try {
      const response = await fetch("/api/deploy-contract", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contractName: contractDetails.name,
          contractContent: generateContractContent(),
        }),
      });

      console.log("the contract", response);
      if (!response.ok) {
        throw new Error("Failed to deploy the contract");
      }

      const data = await response.json();
      setFileCreated(true);
      setErrorMessage(null);

      onDeploy(data.address);
      onNext();
    } catch (error) {
      console.error("Error creating file:", error);
      setFileCreated(false);
      setErrorMessage("Failed to create the file. Please try again.");
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Smart Contract Generator</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="contractName">Contract Name</Label>
            <Input id="contractName" value={contractDetails.name} readOnly />
          </div>
          <div>
            <Label htmlFor="contractSymbol">Contract Symbol</Label>
            <Input
              id="contractSymbol"
              value={contractDetails.symbol}
              readOnly
            />
          </div>
          <div>
            <Label htmlFor="totalSupply">Total Supply</Label>
            <Input
              id="totalSupply"
              value={contractDetails.totalSupply}
              readOnly
            />
          </div>
          <div>
            <Label htmlFor="contractPreview">Contract Preview</Label>
            <Textarea
              id="contractPreview"
              className="font-mono text-sm"
              value={generateContractContent()}
              readOnly
              rows={10}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-start space-y-4">
        <Button onClick={handleCreateFile}>Create Contract File</Button>
        {fileCreated === true && (
          <Alert variant="default">
            <CheckCircle2 className="h-4 w-4" />
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>
              Contract {contractDetails.name} has been deployed successfully.
            </AlertDescription>
          </Alert>
        )}
        {fileCreated === false && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {errorMessage ||
                "There was an error creating the file. Please try again."}
            </AlertDescription>
          </Alert>
        )}
      </CardFooter>
    </Card>
  );
};

export default ContractGenerator;
