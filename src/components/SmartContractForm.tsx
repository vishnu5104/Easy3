"use client";

import { ChangeEvent } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ContractDetails {
  name: string;
  symbol: string;
  totalSupply: number;
}

interface SmartContractFormProps {
  contractDetails: ContractDetails;
  setContractDetails: (details: ContractDetails) => void;
}

const SmartContractForm = ({
  contractDetails,
  setContractDetails,
}: SmartContractFormProps) => {
  const handleChange = (
    e: ChangeEvent<HTMLInputElement>,
    key: keyof ContractDetails
  ) => {
    setContractDetails({ ...contractDetails, [key]: e.target.value });
  };

  return (
    <Card className="w-full max-w-md mx-auto">
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
              onChange={(e) => handleChange(e, "name")}
              placeholder="My Awesome NFT"
            />
          </div>
          <div>
            <Label htmlFor="tokenSymbol">Token Symbol</Label>
            <Input
              id="tokenSymbol"
              value={contractDetails.symbol}
              onChange={(e) => handleChange(e, "symbol")}
              placeholder="AWESOME"
            />
          </div>
          <div>
            <Label htmlFor="totalSupply">Total Supply</Label>
            <Input
              id="totalSupply"
              type="number"
              value={contractDetails.totalSupply}
              onChange={(e) => handleChange(e, "totalSupply")}
              placeholder="10000"
            />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Next</Button>
      </CardFooter>
    </Card>
  );
};

export default SmartContractForm;
