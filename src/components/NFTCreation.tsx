"use client";

import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
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

import { SignProtocolClient, SpMode, OffChainSignType } from "@ethsign/sp-sdk";
import { privateKeyToAccount } from "viem/accounts";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertCircle,
  CheckCircle2,
  Upload,
  FileCode2,
  Tag,
  X,
  ShoppingBag,
  Coins,
  Link,
  ChevronRight,
  ChevronLeft,
  FileImage,
  Loader2,
  Percent,
  Layers,
  Clock,
  Sparkles,
  Zap,
  Music,
  Video,
  File,
  Info,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useDropzone } from "react-dropzone";

import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface NFTCreationProps {
  contractAddress: string;
  marketplaceName: string;
  tokenName: string;
  tokenSymbol: string;
}

export default function NFTCreation({
  contractAddress,
  marketplaceName,
  tokenName,
  tokenSymbol,
}: NFTCreationProps) {
  const [url, setUrl] = useState("");

  const route = useRouter();

  const [file, setFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [nftMetadata, setNftMetadata] = useState({
    name: "",
    description: "",
    attributes: [{ trait_type: "", value: "" }],
  });
  const [currentStep, setCurrentStep] = useState(0);
  const [royaltyPercentage, setRoyaltyPercentage] = useState(10);
  const [collectionName, setCollectionName] = useState("");
  const [blockchain, setBlockchain] = useState("ethereum");
  const [price, setPrice] = useState("");
  const [auctionEnabled, setAuctionEnabled] = useState(false);
  const [auctionDuration, setAuctionDuration] = useState(7);
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [isLimitedEdition, setIsLimitedEdition] = useState(false);
  const [editionSize, setEditionSize] = useState(1);
  const [fileType, setFileType] = useState<"image" | "audio" | "video" | "3d">(
    "image"
  );

  const [name, setName] = useState("");
  const [subdomain, setSubdomain] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [unlockableContent, setUnlockableContent] = useState("");
  const [isLazyMinted, setIsLazyMinted] = useState(false);
  const [tags, setTags] = useState<string[]>([]);

  //attr
  const [schemaInfo, setSchemaInfo] = useState(null);
  const [attestationInfo, setAttestationInfo] = useState(null);
  const [fetchedSchema, setFetchedSchema] = useState(null);
  const [fetchedAttestation, setFetchedAttestation] = useState(null);

  const steps = ["Create NFT", "ONFT721 Configuration", "NFT Preview"];

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setFileType(
        acceptedFiles[0].type.split("/")[0] as "image" | "audio" | "video"
      );
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [],
      "audio/*": [],
      "video/*": [],
      "model/gltf-binary": [],
      ".glb": [],
    },
    multiple: false,
  });

  const handleMetadataChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: string
  ) => {
    setNftMetadata((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleAttributeChange = (
    index: number,
    field: string,
    value: string
  ) => {
    const newAttributes = [...nftMetadata.attributes];
    newAttributes[index] = { ...newAttributes[index], [field]: value };
    setNftMetadata((prev) => ({ ...prev, attributes: newAttributes }));
  };

  const addAttribute = () => {
    setNftMetadata((prev) => ({
      ...prev,
      attributes: [...prev.attributes, { trait_type: "", value: "" }],
    }));
  };

  const removeAttribute = (index: number) => {
    setNftMetadata((prev) => ({
      ...prev,
      attributes: prev.attributes.filter((_, i) => i !== index),
    }));
  };

  const handleUpload = async () => {
    if (!file) {
      setErrorMessage("Please select an image file to upload.");
      return;
    }

    setUploading(true);
    setErrorMessage(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const PINATA_JWT =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJhZGNmZmVlMy03MDIyLTQzYWQtOGYwOC0yZGY1OTQ0NmEzYzEiLCJlbWFpbCI6InZpc2hudS5zMTUwNEBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJGUkExIn0seyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJOWUMxIn1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiZGJkNzI0ZTZmZTI1ZGIwOTQ5OTIiLCJzY29wZWRLZXlTZWNyZXQiOiJlMjMwMjAwZjAzMDRmOTVhMWNlOTkzZTBhMjA2ZGEyMTVjOTk0Y2I2MDU4YWVhYzc4ZTE5MGMyNmI4NGNmMGFhIiwiZXhwIjoxNzU3MTc1NzgxfQ.oJrc0WW9IA_xuvVcI_5KON1hf8x_H_Z1upsFBD0nWdI";
      const imageResponse = await fetch(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${PINATA_JWT}`,
          },
          body: formData,
        }
      );

      const imageResult = await imageResponse.json();

      if (!imageResponse.ok) {
        throw new Error("Failed to upload image to IPFS");
      }

      const imageUrl = `https://dweb.link/ipfs/${imageResult.IpfsHash}`;
      console.log("Image uploaded to IPFS:", imageUrl);

      const metadata = {
        ...nftMetadata,
        image: imageUrl,
        royaltyPercentage,
        collectionName,
        blockchain,
        price,
        auctionEnabled,
        auctionDuration,
        backgroundColor,
        isLimitedEdition,
        editionSize,
        fileType,
        unlockableContent,
        isLazyMinted,
        tags,
      };

      const privateKey =
        "0x705bdfea3af325337deb96821f6c82a207c28c16e15f8778f4365a4b95f1266c";
      const client = new SignProtocolClient(SpMode.OffChain, {
        signType: OffChainSignType.EvmEip712,
        account: privateKeyToAccount(privateKey),
      });

      console.log("Creating schema...");
      const createdSchemaInfo = await client.createSchema({
        name: "NFT Schema",
        data: [
          { name: "nft_name", type: "string" },
          { name: "nft_price", type: "uint256" },
          { name: "image_url", type: "string" },
          { name: "wallet_address", type: "string" },
        ],
      });
      console.log("Schema created:", createdSchemaInfo);
      setSchemaInfo(createdSchemaInfo);

      const schemaIdToUse = createdSchemaInfo.schemaId;

      console.log("Fetching schema...");
      const fetchedSchema = await client.getSchema(schemaIdToUse);

      console.log("Schema fetched:", fetchedSchema);
      setFetchedSchema(fetchedSchema);

      console.log("Creating attestation...");
      const createdAttestationInfo = await client.createAttestation({
        schemaId: schemaIdToUse,
        data: {
          nft_name: metadata.name,
          nft_price: parseFloat(metadata.price) * 1e18,
          image_url: imageUrl,
          wallet_address: "0x1B634d89D6C64E249523A5a199eB52AaDE8297F7",
        },
        indexingValue: metadata.name,
      });

      console.log("Attestation created:", createdAttestationInfo);
      setAttestationInfo(createdAttestationInfo);

      console.log("Fetching attestation...");
      const fetchedAttestation = await client.getAttestation(
        createdAttestationInfo.attestationId
      );

      await fetch("/api/save-schema", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          schemaId: createdAttestationInfo.attestationId,
        }),
      });

      console.log("Attestation fetched:", fetchedAttestation);
      setFetchedAttestation(fetchedAttestation);

      setUploadSuccess(true);

      setMessage("");
      setError("");
      setName(metadata.name);
      setSubdomain(metadata.collectionName);

      try {
        console.log({
          name: metadata.name,
          subdomain: metadata.collectionName,
        });
        const response = await fetch("/api/create-marketplace", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: metadata.name,
            subdomain: metadata.collectionName,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          console.log("Marketplace data:", data);
          setMessage(
            `Marketplace created successfully: ${data.name} (${data.subdomain})`
          );
          route.push(`http://${data.subdomain}.localhost:3000`);
        } else {
          const errorData = await response.json();
          setError(errorData.error || "Failed to create marketplace");
        }
      } catch (error) {
        console.error("Error creating marketplace:", error);
        setError("An error occurred while creating the marketplace");
      }
    } catch (error) {
      console.error("Error uploading NFT:", error);
      setErrorMessage("Failed to upload NFT. Please try again.");
    } finally {
      setUploading(false);
    }
  };
  const calculateRarityScore = () => {
    const totalAttributes = nftMetadata.attributes.length;
    const uniqueAttributes = new Set(
      nftMetadata.attributes.map((attr) => attr.trait_type)
    ).size;
    return ((uniqueAttributes / totalAttributes) * 100).toFixed(2);
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && e.currentTarget.value) {
      setTags([...tags, e.currentTarget.value]);
      e.currentTarget.value = "";
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <Card className="w-full max-w-6xl mx-auto mt-8 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6">
        <CardTitle className="text-3xl font-bold">
          Easy3: Craft Your Digital Asset
        </CardTitle>
        <div className="mt-4 space-y-2">
          <div className="flex items-center space-x-2">
            <ShoppingBag className="h-5 w-5" />
            <span className="font-semibold">Marketplace:</span>
            <Badge variant="secondary" className="text-sm">
              {marketplaceName}
            </Badge>
          </div>
          <div className="flex items-center space-x-2">
            <Link className="h-5 w-5" />
            <span className="font-semibold">Subdomain:</span>
            <Badge variant="secondary" className="text-sm">
              {tokenName} ({tokenSymbol})
            </Badge>
          </div>
          <div className="flex items-center space-x-2">
            <FileCode2 className="h-5 w-5" />
            <span className="font-semibold">Contract:</span>
            <Badge variant="secondary" className="text-sm">
              {contractAddress.slice(0, 6)}...{contractAddress.slice(-4)}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            {steps.map((step, index) => (
              <React.Fragment key={step}>
                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      index <= currentStep
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {index + 1}
                  </div>
                  <span className="mt-2 text-sm">{step}</span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-1 ${
                      index < currentStep ? "bg-blue-500" : "bg-gray-200"
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
        <AnimatePresence mode="wait">
          {currentStep === 0 && (
            <motion.div
              key="create-nft"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="nftName" className="text-lg font-semibold">
                    NFT Name
                  </Label>
                  <Input
                    id="nftName"
                    value={nftMetadata.name}
                    onChange={(e) => handleMetadataChange(e, "name")}
                    placeholder="My Awesome NFT"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="nftPrice"
                    className="text-lg font-semibold flex items-center"
                  >
                    NFT Price
                  </Label>
                  <Input
                    id="nftPrice"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="0.1"
                    type="number"
                    step="0.01"
                    min="0"
                    className="mt-2"
                  />
                </div>
              </div>
              <div>
                <Label
                  htmlFor="nftDescription"
                  className="text-lg font-semibold"
                >
                  Description
                </Label>
                <Textarea
                  id="nftDescription"
                  value={nftMetadata.description}
                  onChange={(e) => handleMetadataChange(e, "description")}
                  placeholder="Describe your NFT..."
                  rows={4}
                  className="mt-2"
                />
              </div>
              <div>
                <Label className="text-lg font-semibold">Attributes</Label>
                {nftMetadata.attributes.map((attr, index) => (
                  <div key={index} className="flex space-x-2 mt-2">
                    <Input
                      value={attr.trait_type}
                      onChange={(e) =>
                        handleAttributeChange(
                          index,
                          "trait_type",
                          e.target.value
                        )
                      }
                      placeholder="Trait Type"
                    />
                    <Input
                      value={attr.value}
                      onChange={(e) =>
                        handleAttributeChange(index, "value", e.target.value)
                      }
                      placeholder="Value"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => removeAttribute(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  onClick={addAttribute}
                  variant="outline"
                  className="mt-4"
                >
                  <Tag className="mr-2 h-4 w-4" /> Add Attribute
                </Button>
              </div>
              <div>
                <Label htmlFor="nftAsset" className="text-lg font-semibold">
                  NFT Asset
                </Label>
                <Tabs defaultValue="upload" className="mt-2">
                  <TabsList>
                    <TabsTrigger value="upload">Upload File</TabsTrigger>
                    <TabsTrigger value="link">Link URL</TabsTrigger>
                  </TabsList>
                  <TabsContent value="upload">
                    <div
                      {...getRootProps()}
                      className={`mt-2 border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                        isDragActive
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-900"
                          : "border-gray-300 dark:border-gray-700"
                      }`}
                    >
                      <input {...getInputProps()} />
                      {file ? (
                        <div className="flex flex-col items-center">
                          <FileImage className="w-16 h-16 text-blue-500 mb-4" />
                          <p className="text-lg font-semibold">{file.name}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      ) : isDragActive ? (
                        <div className="flex flex-col items-center">
                          <Loader2 className="w-16 h-16 text-blue-500 animate-spin mb-4" />
                          <p className="text-lg font-semibold">
                            Drop your file here
                          </p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <Upload className="w-16 h-16 text-gray-400 mb-4" />
                          <p className="text-lg font-semibold">
                            Drag & Drop or Click to Upload
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                            Supports images, audio, video, and 3D models
                          </p>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                  <TabsContent value="link">
                    <Input
                      type="url"
                      placeholder="Paste your NFT URL"
                      value={fileUrl}
                      onChange={(e) => setFileUrl(e.target.value)}
                      className="mt-2"
                    />
                  </TabsContent>
                </Tabs>
              </div>
              <div>
                <Label htmlFor="tags" className="text-lg font-semibold">
                  Tags
                </Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="ml-2 h-4 w-4 p-0"
                        onClick={() => removeTag(tag)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
                <Input
                  id="tags"
                  placeholder="Add tags (press Enter)"
                  onKeyDown={handleAddTag}
                  className="mt-2"
                />
              </div>
            </motion.div>
          )}
          {currentStep === 1 && (
            <motion.div
              key="marketplace-configuration"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <h3 className="text-2xl font-bold">ONFT 721 Configuration</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label
                    htmlFor="royaltyPercentage"
                    className="text-lg font-semibold flex items-center"
                  >
                    Royalty Percentage
                  </Label>
                  <div className="flex items-center space-x-2 mt-2">
                    <Percent className="h-5 w-5 text-gray-500" />
                    <Input
                      id="royaltyPercentage"
                      type="number"
                      value={royaltyPercentage}
                      onChange={(e) =>
                        setRoyaltyPercentage(Number(e.target.value))
                      }
                      min="0"
                      max="100"
                      className="w-20"
                    />
                    <span>%</span>
                  </div>
                </div>
                <div>
                  <Label
                    htmlFor="collectionName"
                    className="text-lg font-semibold"
                  >
                    Collection Name
                  </Label>
                  <div className="flex items-center space-x-2 mt-2">
                    <Layers className="h-5 w-5 text-gray-500" />
                    <Input
                      id="collectionName"
                      value={collectionName}
                      onChange={(e) => setCollectionName(e.target.value)}
                      placeholder="My Awesome Collection"
                    />
                  </div>
                </div>

                <div>
                  <Label
                    htmlFor="auctionEnabled"
                    className="text-lg font-semibold"
                  >
                    Enable Auction
                  </Label>
                  <div className="flex items-center space-x-2 mt-2">
                    <Clock className="h-5 w-5 text-gray-500" />
                    <Switch
                      id="auctionEnabled"
                      checked={auctionEnabled}
                      onCheckedChange={setAuctionEnabled}
                    />
                  </div>
                </div>
                {auctionEnabled && (
                  <div>
                    <Label
                      htmlFor="auctionDuration"
                      className="text-lg font-semibold"
                    >
                      Auction Duration (days)
                    </Label>
                    <div className="flex items-center space-x-2 mt-2">
                      <Clock className="h-5 w-5 text-gray-500" />
                      <Slider
                        id="auctionDuration"
                        min={1}
                        max={30}
                        step={1}
                        value={[auctionDuration]}
                        onValueChange={(value) => setAuctionDuration(value[0])}
                      />
                      <span>{auctionDuration} days</span>
                    </div>
                  </div>
                )}

                <div>
                  <Label
                    htmlFor="isLimitedEdition"
                    className="text-lg font-semibold"
                  >
                    Limited Edition
                  </Label>
                  <div className="flex items-center space-x-2 mt-2">
                    <Switch
                      id="isLimitedEdition"
                      checked={isLimitedEdition}
                      onCheckedChange={setIsLimitedEdition}
                    />
                    <span>{isLimitedEdition ? "Yes" : "No"}</span>
                  </div>
                </div>
                {isLimitedEdition && (
                  <div>
                    <Label
                      htmlFor="editionSize"
                      className="text-lg font-semibold"
                    >
                      Edition Size
                    </Label>
                    <Input
                      id="editionSize"
                      type="number"
                      value={editionSize}
                      onChange={(e) => setEditionSize(Number(e.target.value))}
                      min="1"
                      className="mt-2"
                    />
                  </div>
                )}

                <div>
                  <Label
                    htmlFor="isLazyMinted"
                    className="text-lg font-semibold"
                  >
                    Lazy Minting
                  </Label>
                  <div className="flex items-center space-x-2 mt-2">
                    <Switch
                      id="isLazyMinted"
                      checked={isLazyMinted}
                      onCheckedChange={setIsLazyMinted}
                    />
                    <span>{isLazyMinted ? "Enabled" : "Disabled"}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          {currentStep === 2 && (
            <motion.div
              key="preview"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <h3 className="text-2xl font-bold">NFT Preview</h3>
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900 dark:to-purple-900 rounded-lg p-6 shadow-inner">
                <div className="flex flex-col md:flex-row gap-6">
                  {(file || fileUrl) && (
                    <div className="w-full md:w-1/2">
                      <div
                        className="aspect-square rounded-lg overflow-hidden shadow-lg"
                        style={{ backgroundColor }}
                      >
                        {fileType === "image" && (
                          <img
                            src={file ? URL.createObjectURL(file) : fileUrl}
                            alt="NFT Preview"
                            className="w-full h-full object-contain"
                          />
                        )}
                        {fileType === "audio" && (
                          <div className="w-full h-full flex items-center justify-center">
                            <Music className="w-24 h-24 text-gray-400" />
                          </div>
                        )}
                        {fileType === "video" && (
                          <div className="w-full h-full flex items-center justify-center">
                            <Video className="w-24 h-24 text-gray-400" />
                          </div>
                        )}
                        {fileType === "3d" && (
                          <div className="w-full h-full flex items-center justify-center">
                            <File className="w-24 h-24 text-gray-400" />
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  <div className="w-full md:w-1/2 space-y-4">
                    <h4 className="text-2xl font-semibold">
                      {nftMetadata.name || "Untitled NFT"}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300">
                      {nftMetadata.description || "No description provided"}
                    </p>
                    <p className="text-blue-500 font-semibold">
                      Price: {price}{" "}
                      {blockchain === "ethereum"
                        ? "ETH"
                        : blockchain === "polygon"
                          ? "MATIC"
                          : blockchain === "solana"
                            ? "SOL"
                            : "BNB"}
                    </p>
                    {nftMetadata.attributes.length > 0 && (
                      <div>
                        <h5 className="font-semibold mt-4 mb-2">Attributes:</h5>
                        <div className="grid grid-cols-2 gap-2">
                          {nftMetadata.attributes.map((attr, index) => (
                            <div
                              key={index}
                              className="bg-white dark:bg-gray-700 rounded p-2 text-sm"
                            >
                              <span className="font-medium">
                                {attr.trait_type}:
                              </span>{" "}
                              {attr.value}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="mt-4">
                      <h5 className="font-semibold">Rarity Score:</h5>
                      <div className="flex items-center mt-2">
                        <Sparkles className="h-5 w-5 text-yellow-500 mr-2" />
                        <span className="text-lg font-bold">
                          {calculateRarityScore()}%
                        </span>
                      </div>
                    </div>
                    {isLimitedEdition && (
                      <div className="mt-4">
                        <h5 className="font-semibold">Limited Edition:</h5>
                        <p>Edition Size: {editionSize}</p>
                      </div>
                    )}
                    <div className="mt-4">
                      <h5 className="font-semibold">Marketplace Details:</h5>
                      <p>Collection: {collectionName}</p>
                      <p>Blockchain: Hedera</p>
                      <p>Royalty: {royaltyPercentage}%</p>
                      {auctionEnabled && (
                        <p>Auction Duration: {auctionDuration} days</p>
                      )}
                      <p>
                        Lazy Minting: {isLazyMinted ? "Enabled" : "Disabled"}
                      </p>
                    </div>
                    {unlockableContent && (
                      <div className="mt-4">
                        <h5 className="font-semibold">Unlockable Content:</h5>
                        <p className="text-sm text-gray-500">
                          (Hidden until purchased)
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
      <CardFooter className="flex justify-between items-center p-6 bg-gray-50 dark:bg-gray-800">
        <Button
          onClick={prevStep}
          disabled={currentStep === 0}
          variant="outline"
          className="flex items-center"
        >
          <ChevronLeft className="mr-2 h-4 w-4" /> Previous
        </Button>
        {currentStep < steps.length - 1 ? (
          <Button
            onClick={nextStep}
            className="flex items-center bg-blue-500 hover:bg-blue-600 text-white"
          >
            Next <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button
            onClick={handleUpload}
            disabled={uploading || (!file && !fileUrl)}
            className="flex items-center bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-2 px-4 rounded-full transition-all duration-200 ease-in-out transform hover:scale-105"
          >
            {uploading ? (
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
                Minting NFT...
              </span>
            ) : (
              <>
                <Zap className="mr-2 h-5 w-5" /> Mint NFT
              </>
            )}
          </Button>
        )}
      </CardFooter>
      {(uploadSuccess || errorMessage) && (
        <div className="p-6 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          {uploadSuccess && (
            <Alert
              variant="default"
              className="w-full bg-green-100 dark:bg-green-900"
            >
              <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
              <AlertTitle className="text-green-800 dark:text-green-200">
                Success
              </AlertTitle>
              <AlertDescription className="text-green-700 dark:text-green-300">
                Your NFT has been created and minted successfully!
              </AlertDescription>
            </Alert>
          )}
          {errorMessage && (
            <Alert variant="destructive" className="w-full">
              <AlertCircle className="h-5 w-5" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}
        </div>
      )}
    </Card>
  );
}
