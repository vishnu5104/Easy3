import React, { useCallback, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
interface ContractDetails {
  name: string;
  symbol: string;
}
const ContractPreview = ({
  contractDetails,
}: {
  contractDetails: ContractDetails;
}) => {
  const [contractTemplate, setContractTemplate] = useState("");

  const fetchContractTemplate = useCallback(async () => {
    try {
      const response = await fetch(
        `/api/contract-template?name=${
          contractDetails.name || "MyNFT"
        }&symbol=${contractDetails.symbol || "NFT"}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.text();
      setContractTemplate(data);
    } catch (error) {
      console.error("Failed to fetch contract template:", error);
    }
  }, [contractDetails.name, contractDetails.symbol]);

  useEffect(() => {
    fetchContractTemplate();
  }, [fetchContractTemplate]);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Smart Contract Preview</CardTitle>
      </CardHeader>
      <CardContent>
        <pre className="font-mono text-sm h-[calc(100vh-200px)] overflow-auto">
          {contractTemplate}
        </pre>
      </CardContent>
    </Card>
  );
};

export default ContractPreview;
