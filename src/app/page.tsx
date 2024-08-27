"use client";
import ContractGenerator from "@/components/ContractGenerator";
import SmartContractForm from "@/components/SmartContractForm";
import { useState } from "react";

export default function Home() {
  const [contractDetails, setContractDetails] = useState({
    name: "",
    symbol: "",
    totalSupply: 0,
  });

  return (
    <>
      <h1 className="text-3xl font-bold mb-6 text-center">Easy3</h1>
      <SmartContractForm
        contractDetails={contractDetails}
        setContractDetails={setContractDetails}
      />
      <ContractGenerator contractDetails={} onDeploy={} onNext={} onPrev={} />
    </>
  );
}
