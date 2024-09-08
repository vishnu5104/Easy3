"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenu,
} from "@/components/ui/dropdown-menu";
import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  Card,
} from "@/components/ui/card";
import { AvatarImage, AvatarFallback, Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Search, ChevronDown, Heart, Zap, Trophy, Star } from "lucide-react";
import { SignProtocolClient, SpMode, OffChainSignType } from "@ethsign/sp-sdk";
import { privateKeyToAccount } from "viem/accounts";

import ids from "../../../schema.json";

export default function EnhancedMarketplacePage({
  params,
}: {
  params: { subdomain: string };
}) {
  const { subdomain } = params;
  const [nftData, setNftData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const privateKey =
        "0x705bdfea3af325337deb96821f6c82a207c28c16e15f8778f4365a4b95f1266c";
      const client = new SignProtocolClient(SpMode.OffChain, {
        signType: OffChainSignType.EvmEip712,
        account: privateKeyToAccount(privateKey),
      });

      try {
        setLoading(true);
        setError(null);
        const fetchPromises = ids.map((id) =>
          client.getAttestation(id.schemaId)
        );
        const results = await Promise.all(fetchPromises);
        const nfts = results.map((result) => result.data).filter(Boolean);
        console.log("Fetched data:", nfts);
        setNftData(nfts);
      } catch (error) {
        console.error("Error fetching attestations:", error);
        setError("Failed to fetch NFT data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    console.log("Current nftData:", nftData);
  }, [nftData]);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-[url('/hero-bg.svg')] bg-cover bg-center">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
                  Discover, Collect, and Create Extraordinary NFTs on{" "}
                  {subdomain.toUpperCase()} Marketplace
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Dive into the world's most innovative NFT marketplace. Unearth
                  rare digital treasures and unleash your creativity.
                </p>
              </div>
              <div className="space-x-4">
                <Button className="bg-purple-600 hover:bg-purple-700">
                  Explore NFTs
                </Button>
                <Button variant="outline">Create NFT</Button>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-8">
              Live Auctions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {loading ? (
                Array.from({ length: 3 }).map((_, index) => (
                  <Card
                    key={index}
                    className="overflow-hidden bg-white dark:bg-gray-800 border-2 border-purple-200 dark:border-purple-800"
                  >
                    <CardContent className="p-4">
                      <div className="animate-pulse flex space-x-4">
                        <div className="rounded-full bg-slate-200 h-10 w-10"></div>
                        <div className="flex-1 space-y-6 py-1">
                          <div className="h-2 bg-slate-200 rounded"></div>
                          <div className="space-y-3">
                            <div className="grid grid-cols-3 gap-4">
                              <div className="h-2 bg-slate-200 rounded col-span-2"></div>
                              <div className="h-2 bg-slate-200 rounded col-span-1"></div>
                            </div>
                            <div className="h-2 bg-slate-200 rounded"></div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : error ? (
                <Card className="overflow-hidden bg-white dark:bg-gray-800 border-2 border-red-200 dark:border-red-800">
                  <CardContent className="p-4">
                    <CardTitle className="text-red-600">Error</CardTitle>
                    <CardDescription>{error}</CardDescription>
                    <Button
                      onClick={() => window.location.reload()}
                      className="mt-4"
                    >
                      Retry
                    </Button>
                  </CardContent>
                </Card>
              ) : nftData.length > 0 ? (
                nftData.map((nft, index) => (
                  <Link
                    key={index}
                    href={`/${subdomain}/nft/${nft.id || index}`}
                    passHref
                  >
                    <Card className="overflow-hidden bg-white dark:bg-gray-800 border-2 border-purple-200 dark:border-purple-800 cursor-pointer transition-all hover:shadow-lg">
                      <CardHeader className="p-0">
                        <img
                          alt={nft.nft_name || "NFT"}
                          className="w-full h-64 object-cover"
                          height="256"
                          src={nft.image_url || "/placeholder.svg"}
                          width="100%"
                        />
                      </CardHeader>
                      <CardContent className="p-4">
                        <CardTitle>{nft.nft_name || "Unnamed NFT"}</CardTitle>
                        <CardDescription>
                          {nft.description || "No description available"}
                        </CardDescription>
                        <div className="mt-4 flex justify-between items-center">
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Price
                            </p>
                            <p className="font-bold text-lg">
                              {nft.nft_price
                                ? `${nft.nft_price / 1e18} ETH`
                                : "Price not available"}
                            </p>
                          </div>
                          <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                            Buy Now
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))
              ) : (
                <Card className="overflow-hidden bg-white dark:bg-gray-800 border-2 border-yellow-200 dark:border-yellow-800">
                  <CardContent className="p-4">
                    <CardTitle className="text-yellow-600">No Data</CardTitle>
                    <CardDescription>
                      No NFT data is currently available.
                    </CardDescription>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-purple-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-8">
              Top Collections
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <Card
                  key={i}
                  className="overflow-hidden bg-white dark:bg-gray-800"
                >
                  <CardHeader className="p-0">
                    <img
                      alt={`Collection ${i}`}
                      className="w-full h-48 object-cover"
                      height="200"
                      src={`/collection-${i}.jpg`}
                      width="300"
                    />
                  </CardHeader>
                  <CardContent className="p-4">
                    <CardTitle>Neon Punks</CardTitle>
                    <CardDescription>10,000 unique characters</CardDescription>
                    <div className="mt-4 flex justify-between items-center">
                      <div className="flex items-center">
                        <Avatar className="h-8 w-8 mr-2">
                          <AvatarImage
                            alt="Creator"
                            src="/creator-avatar.jpg"
                          />
                          <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium">CryptoNerd</span>
                      </div>
                      <Badge variant="secondary">
                        <Zap className="h-4 w-4 mr-1" />
                        Trending
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-8">
              Explore NFTs
            </h2>
            <div className="flex flex-col md:flex-row justify-between items-center mb-8">
              <Input
                className="max-w-sm"
                placeholder="Search NFTs"
                type="search"
              />
              <div className="flex gap-4 mt-4 md:mt-0">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      Category
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>Art</DropdownMenuItem>
                    <DropdownMenuItem>Music</DropdownMenuItem>
                    <DropdownMenuItem>Virtual Worlds</DropdownMenuItem>
                    <DropdownMenuItem>Trading Cards</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      Price Range
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>Under 1 ETH</DropdownMenuItem>
                    <DropdownMenuItem>1-5 ETH</DropdownMenuItem>
                    <DropdownMenuItem>5-10 ETH</DropdownMenuItem>
                    <DropdownMenuItem>Over 10 ETH</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <Card
                  key={i}
                  className="overflow-hidden bg-white dark:bg-gray-800 border border-purple-200 dark:border-purple-800"
                >
                  <CardHeader className="p-0 relative">
                    <img
                      alt={`NFT ${i + 1}`}
                      className="w-full h-48 object-cover"
                      height="200"
                      src={`/nft-${i + 1}.jpg`}
                      width="300"
                    />
                    <Badge className="absolute top-2 right-2 bg-black/50 text-white">
                      Rarity: {95 - i}%
                    </Badge>
                  </CardHeader>
                  <CardContent className="p-4">
                    <CardTitle>Quantum Leap #{i + 1}</CardTitle>
                    <CardDescription>By Futurist Labs</CardDescription>
                    <div className="flex justify-between items-center mt-4">
                      <span className="font-bold">2.5 ETH</span>
                      <Button size="sm" variant="outline">
                        <Heart className="h-4 w-4 mr-2" />
                        {42 - i}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="mt-12 flex justify-center">
              <Button>Load More</Button>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-8">
              Creator Spotlight
            </h2>
            <div className="flex flex-col md:flex-row items-center gap-8">
              <Avatar className="h-32 w-32">
                <AvatarImage
                  alt="Featured Creator"
                  src="/featured-creator.jpg"
                />
                <AvatarFallback>FC</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-2xl font-bold mb-2">PixelMaster</h3>
                <p className="text-lg mb-4">
                  Revolutionizing digital art with vibrant pixel creations
                </p>
                <div className="flex gap-4">
                  <Button variant="secondary">View Gallery</Button>
                  <Button variant="outline">Follow</Button>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-8">
              Gamification
            </h2>
            <Card className="bg-white dark:bg-gray-700">
              <CardContent className="p-6">
                <h3 className="text-2xl font-bold mb-4">Your NFT Journey</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>Collector Level</span>
                      <span>Silver</span>
                    </div>
                    <Progress value={65} />
                  </div>
                  <div className="flex justify-between items-center">
                    <span>NFTs Collected</span>
                    <Badge variant="secondary">
                      <Trophy className="h-4 w-4 mr-1" />
                      23/100
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Rare Finds</span>
                    <Badge variant="secondary">
                      <Star className="h-4 w-4 mr-1" />5
                    </Badge>
                  </div>
                </div>
                <Button className="w-full mt-6">View Achievements</Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </div>
  );
}

function DiamondIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2.7 10.3a2.41 2.41 0 0 0 0 3.41l7.59 7.59a2.41 2.41 0 0 0 3.41 0l7.59-7.59a2.41 2.41 0 0 0 0-3.41l-7.59-7.59a2.41 2.41 0 0 0-3.41 0Z" />
    </svg>
  );
}
