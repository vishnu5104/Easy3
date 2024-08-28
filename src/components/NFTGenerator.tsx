import React, { useState } from "react";
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

import { useRouter } from "next/navigation";

const NFTGenerator = ({ nfts, setNfts, onPublish }) => {
  const router = useRouter();

  const [currentNFT, setCurrentNFT] = useState({
    name: "",
    description: "",
    image: "",
  });

  const addNFT = () => {
    if (currentNFT.name && currentNFT.description && currentNFT.image) {
      setNfts((prevNfts) => [...prevNfts, { ...currentNFT, id: Date.now() }]);
      setCurrentNFT({ name: "", description: "", image: "" });
    }
  };

  const handlePublish = () => {
    onPublish();
    router.push("/nftp");
  };
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Create NFTs</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="nftName">NFT Name</Label>
            <Input
              id="nftName"
              value={currentNFT.name}
              onChange={(e) =>
                setCurrentNFT((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="My Awesome NFT #1"
            />
          </div>
          <div>
            <Label htmlFor="nftDescription">Description</Label>
            <Textarea
              id="nftDescription"
              value={currentNFT.description}
              onChange={(e) =>
                setCurrentNFT((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="A unique and awesome NFT"
            />
          </div>
          <div>
            <Label htmlFor="nftImage">Image URL</Label>
            <Input
              id="nftImage"
              value={currentNFT.image}
              onChange={(e) =>
                setCurrentNFT((prev) => ({ ...prev, image: e.target.value }))
              }
              placeholder="https://example.com/image.png"
            />
          </div>
          <Button onClick={addNFT} className="w-full">
            Add NFT
          </Button>
        </div>
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Created NFTs</h3>
          {nfts.map((nft) => (
            <div key={nft.id} className="border p-2 mb-2 rounded">
              <p>
                <strong>{nft.name}</strong>
              </p>
              <p>{nft.description}</p>
              <img src={nft.image} alt={nft.name} className="w-full" />
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handlePublish} className="w-full">
          Publish NFTs
        </Button>
      </CardFooter>
    </Card>
  );
};

export default NFTGenerator;
