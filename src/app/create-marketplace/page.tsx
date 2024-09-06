"use client";

import ContractPreview from "@/components/ContractPreview";
import NFTCreation from "@/components/NFTCreation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import React, { useEffect, useState } from "react";
interface ContractDetails {
  name: string;
  symbol: string;
  totalSupply: number;
}
const CreateMarketplace = () => {
  const [contractDetails, setContractDetails] = useState<ContractDetails>({
    name: "",
    symbol: "",
    totalSupply: 0,
  });
  const [isDeploying, setIsDeploying] = useState(false);
  const [fileCreated, setFileCreated] = useState<boolean | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [contractAddress, setContractAddress] = useState<string | null>(null);

  const handleCreateFile = async () => {
    setIsDeploying(true);
    setFileCreated(null);
    setErrorMessage(null);

    try {
      const response = await fetch(
        `/api/contract-template?name=${contractDetails.name || "MyNFT"}&symbol=${contractDetails.symbol || "NFT"}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch contract template");
      }

      const contractContent = await response.text();

      const createFileResponse = await fetch("/api/create-contract", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contractName: contractDetails.name,
          contractContent,
        }),
      });

      if (!createFileResponse.ok) {
        throw new Error("Failed to deploy the contract");
      }

      const data = await createFileResponse.json();
      setFileCreated(true);
      setContractAddress(data.contractAddress);

      console.log("Contract address updated:", data.contractAddress);
    } catch (error) {
      console.error("Error creating file:", error);
      setFileCreated(false);
      setErrorMessage("Failed to create the file. Please try again.");
    } finally {
      setIsDeploying(false);
    }
  };

  useEffect(() => {
    if (contractAddress) {
      console.log("Contract address is now set:", contractAddress);
    }
  }, [contractAddress]);
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">NFT Builder</h1>
      {contractAddress ? (
        <NFTCreation contractAddress={contractAddress} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Create Smart Contract</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="contractName">NFT Contract Name</Label>
                  <Input
                    id="contractName"
                    value={contractDetails.name}
                    onChange={(e) =>
                      setContractDetails((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    placeholder="My Awesome NFT"
                  />
                </div>
                <div>
                  <Label htmlFor="tokenSymbol">Token Symbol</Label>
                  <Input
                    id="tokenSymbol"
                    value={contractDetails.symbol}
                    onChange={(e) =>
                      setContractDetails((prev) => ({
                        ...prev,
                        symbol: e.target.value,
                      }))
                    }
                    placeholder="AWESOME"
                  />
                </div>
                <div>
                  <Label htmlFor="totalSupply">Total Supply</Label>
                  <Input
                    id="totalSupply"
                    type="number"
                    value={contractDetails.totalSupply}
                    onChange={(e) =>
                      setContractDetails((prev) => ({
                        ...prev,
                        totalSupply: parseInt(e.target.value, 10) || 0,
                      }))
                    }
                    placeholder="10000"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col items-start space-y-4">
              <Button onClick={handleCreateFile} disabled={isDeploying}>
                {isDeploying ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Deploying...
                  </span>
                ) : (
                  "Create Contract File"
                )}
              </Button>
              {fileCreated === true && (
                <Alert variant="default">
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertTitle>Success</AlertTitle>
                  <AlertDescription>
                    Contract {contractDetails.name} has been deployed
                    successfully.
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
          <ContractPreview contractDetails={contractDetails} />
        </div>
      )}
    </div>
  );
};

export default CreateMarketplace;
