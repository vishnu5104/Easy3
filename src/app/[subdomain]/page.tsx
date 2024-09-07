"use client";

import React, { useEffect, useState } from "react";
import { SignProtocolClient, SpMode, OffChainSignType } from "@ethsign/sp-sdk";
import { privateKeyToAccount } from "viem/accounts";

const SubdomainPage = ({ params }: { params: { subdomain: string } }) => {
  const [schemaInfo, setSchemaInfo] = useState(null);
  const [attestationInfo, setAttestationInfo] = useState(null);
  const [revokeAttestationRes, setRevokeAttestationRes] = useState(null);
  const [fetchedSchema, setFetchedSchema] = useState(null);
  const [fetchedAttestation, setFetchedAttestation] = useState(null);
  const [error, setError] = useState(null);

  const { subdomain } = params;

  useEffect(() => {
    const runAsyncTasks = async () => {
      try {
        const privateKey = "";
        const client = new SignProtocolClient(SpMode.OffChain, {
          signType: OffChainSignType.EvmEip712,
          account: privateKeyToAccount(privateKey),
        });

        const createdSchemaInfo = await client.createSchema({
          name: "marketplace",
          data: [{ name: "name", type: "string" }],
        });
        setSchemaInfo(createdSchemaInfo);

        const createdAttestationInfo = await client.createAttestation({
          schemaId: createdSchemaInfo.schemaId,
          data: { name: "a" },
          indexingValue: "xxx",
        });
        setAttestationInfo(createdAttestationInfo);

        const fetchedSchema = await client.getSchema(
          createdSchemaInfo.schemaId
        );
        setFetchedSchema(fetchedSchema);

        const fetchedAttestation = await client.getAttestation(
          createdAttestationInfo.attestationId
        );
        setFetchedAttestation(fetchedAttestation);

        const revokeRes = await client.revokeAttestation(
          createdAttestationInfo.attestationId,
          { reason: "test" }
        );
        setRevokeAttestationRes(revokeRes);
      } catch (err) {
        setError(err.message);
      }
    };

    runAsyncTasks();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl font-bold mb-8">Marketplace: {subdomain}</h1>
      {error && <p>Error: {error}</p>}
      <div>
        <h2>Schema Info:</h2>
        <pre>{JSON.stringify(schemaInfo, null, 2)}</pre>
      </div>
      <div>
        <h2>Attestation Info:</h2>
        <pre>{JSON.stringify(attestationInfo, null, 2)}</pre>
      </div>
      <div>
        <h2>Fetched Schema:</h2>
        <pre>{JSON.stringify(fetchedSchema, null, 2)}</pre>
      </div>
      <div>
        <h2>Fetched Attestation:</h2>
        <pre>{JSON.stringify(fetchedAttestation, null, 2)}</pre>
      </div>
      <div>
        <h2>Revoke Attestation Response:</h2>
        <pre>{JSON.stringify(revokeAttestationRes, null, 2)}</pre>
      </div>
    </div>
  );
};

export default SubdomainPage;
