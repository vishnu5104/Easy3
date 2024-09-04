"use client";
import ContractGenerator from "@/components/ContractGenerator";
import NFTGenerator from "@/components/NFTGenerator";
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
      <div>Hii</div>
    </>
  );
}
