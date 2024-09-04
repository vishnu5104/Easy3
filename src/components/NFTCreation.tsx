import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2 } from "lucide-react";

const NFTCreation = ({ contractAddress }: { contractAddress: string }) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setErrorMessage("Please select a file to upload.");
      return;
    }

    setUploading(true);
    setErrorMessage(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      console.log("the contract address", contractAddress);
      formData.append("contractAddress", contractAddress);

      const response = await fetch("/api/upload-nft", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload NFT image");
      }

      setUploadSuccess(true);
    } catch (error) {
      console.error("Error uploading NFT image:", error);
      setErrorMessage("Failed to upload NFT image. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card className="max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle>Upload Image for Contract: {contractAddress}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="nftImage">NFT Image</Label>
            <Input
              id="nftImage"
              type="file"
              onChange={handleFileChange}
              accept="image/*"
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-start space-y-4">
        <Button onClick={handleUpload} disabled={uploading || !file}>
          {uploading ? "Uploading..." : "Upload NFT Image"}
        </Button>
        {uploadSuccess && (
          <Alert variant="default">
            <CheckCircle2 className="h-4 w-4" />
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>
              NFT image has been uploaded successfully.
            </AlertDescription>
          </Alert>
        )}
        {errorMessage && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}
      </CardFooter>
    </Card>
  );
};

export default NFTCreation;
