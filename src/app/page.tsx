"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useAnimation } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRight, Box, Zap, Globe, Wallet } from "lucide-react";
import Link from "next/link";

const Logo = () => (
  <svg
    className="h-10 w-10"
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M20 0L37.3205 10V30L20 40L2.67949 30V10L20 0Z"
      fill="url(#logo-gradient)"
    />
    <path d="M15 15H25V25H15V15Z" fill="white" />
    <path
      d="M10 20L15 15M25 15L30 20M30 20L25 25M15 25L10 20"
      stroke="white"
      strokeWidth="2"
    />
    <text
      x="20"
      y="22"
      fontFamily="Arial"
      fontSize="8"
      fill="white"
      textAnchor="middle"
      dominantBaseline="middle"
    >
      E3
    </text>
    <defs>
      <linearGradient
        id="logo-gradient"
        x1="0"
        y1="0"
        x2="40"
        y2="40"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#4FD1C5" />
        <stop offset="1" stopColor="#63B3ED" />
      </linearGradient>
    </defs>
  </svg>
);
function AwesomeE3Design() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const controls = useAnimation();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
    }[] = [];

    for (let i = 0; i < 100; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 5 + 1,
        speedX: Math.random() * 3 - 1.5,
        speedY: Math.random() * 3 - 1.5,
      });
    }

    function drawParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((particle) => {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
        ctx.fill();

        particle.x += particle.speedX;
        particle.y += particle.speedY;

        if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;
      });
      requestAnimationFrame(drawParticles);
    }

    drawParticles();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    controls.start({
      scale: [1, 1.1, 1],
      transition: { duration: 2, repeat: Infinity, ease: "easeInOut" },
    });
  }, [controls]);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
        <motion.div
          animate={controls}
          className="text-9xl text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-blue-300 to-indigo-300 animate-gradient-x"
        >
          E3
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-[60px] mt-4 text-3xl text-blue-100"
        >
          Built to build awesome things{" "}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="text-[30px] mt-[30px] text-xl text-blue-200 text-center"
        >
          Build your NFT marketplace with unparalleled ease
        </motion.p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-8 px-6 py-3 bg-white text-blue-700 font-semibold rounded-full shadow-lg hover:bg-blue-50 transition-colors duration-300 flex items-center justify-center"
        >
          <span>Start Building Now</span>
          <ArrowRight className="ml-2 h-5 w-5" />
        </motion.button>
      </div>
    </div>
  );
}

export default function Home() {
  const [activeTab, setActiveTab] = useState("art");
  const [isAnimating, setIsAnimating] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 500);
    return () => clearTimeout(timer);
  }, [activeTab]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-600 via-indigo-700 to-teal-500">
      <header
        className={`px-4 lg:px-6 h-16 flex items-center transition-all duration-300 sticky top-0 z-50 ${
          isScrolled
            ? "bg-gradient-to-r from-blue-900/90 to-indigo-900/90 backdrop-blur-md shadow-lg"
            : "bg-transparent"
        }`}
      >
        <a className="flex items-center justify-center" href="#">
          <Logo />
          <span className="ml-2 text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-indigo-300">
            Easy 3
          </span>
        </a>
        <nav className="ml-auto flex items-center gap-4 sm:gap-6">
          <Link
            href="/create-marketplace"
            className="text-sm font-medium text-white hover:text-teal-300 transition-colors"
          >
            Create Marketplace
          </Link>
          <Link
            href="#features"
            className="text-sm font-medium text-white hover:text-teal-300 transition-colors"
          >
            Features
          </Link>
          <Link
            href="#how-it-works"
            className="text-sm font-medium text-white hover:text-teal-300 transition-colors"
          >
            How It Works
          </Link>
          <Link
            href="#contact"
            className="text-sm font-medium text-white hover:text-teal-300 transition-colors"
          >
            Contact
          </Link>
          <Button className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-blue-500 to-teal-400 hover:from-blue-600 hover:to-teal-500 text-white transition-all duration-300 ease-in-out transform hover:scale-105">
            <Wallet className="h-4 w-4" />
            Connect Wallet
          </Button>
        </nav>
      </header>
      <main className="flex-1">
        <AwesomeE3Design />
        <section id="showcase" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-blue-300">
              Explore Marketplace
            </h2>
            <Tabs
              defaultValue="art"
              className="w-full"
              value={activeTab}
              onValueChange={setActiveTab}
            >
              <TabsList className="grid w-full grid-cols-3 mb-8 bg-white/10 rounded-lg p-1">
                <TabsTrigger
                  value="art"
                  className="text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-teal-400"
                >
                  Art
                </TabsTrigger>
                <TabsTrigger
                  value="collectibles"
                  className="text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-teal-400"
                >
                  Collectibles
                </TabsTrigger>
                <TabsTrigger
                  value="gaming"
                  className="text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-teal-400"
                >
                  Gaming
                </TabsTrigger>
              </TabsList>
              <div
                className={`transition-all duration-500 ${isAnimating ? "opacity-0 scale-95" : "opacity-100 scale-100"}`}
              >
                <TabsContent
                  value="art"
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  <Card className="bg-gradient-to-br from-teal-500/20 to-blue-500/20 border-white/10 overflow-hidden">
                    <CardContent className="p-0">
                      <div className="relative aspect-video overflow-hidden">
                        <img
                          alt="Art NFT Marketplace"
                          className="object-cover w-full h-full transition-all duration-300 transform hover:scale-110"
                          height="300"
                          src="/placeholder.svg?height=300&width=400"
                          width="400"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                          <div>
                            <h3 className="text-xl font-semibold text-white mb-2">
                              ArtBlock Gallery
                            </h3>
                            <p className="text-sm text-teal-200">
                              Curated digital art marketplace
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border-white/10 overflow-hidden">
                    <CardContent className="p-0">
                      <div className="relative aspect-video overflow-hidden">
                        <img
                          alt="Art NFT Marketplace"
                          className="object-cover w-full h-full transition-all duration-300 transform hover:scale-110"
                          height="300"
                          src="/placeholder.svg?height=300&width=400"
                          width="400"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                          <div>
                            <h3 className="text-xl font-semibold text-white mb-2">
                              PixelPulse
                            </h3>
                            <p className="text-sm text-blue-200">
                              Pixel art NFT ecosystem
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent
                  value="collectibles"
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  <Card className="bg-gradient-to-br from-indigo-500/20 to-teal-500/20 border-white/10 overflow-hidden">
                    <CardContent className="p-0">
                      <div className="relative aspect-video overflow-hidden">
                        <img
                          alt="Collectibles NFT Marketplace"
                          className="object-cover w-full h-full transition-all duration-300 transform hover:scale-110"
                          height="300"
                          src="/placeholder.svg?height=300&width=400"
                          width="400"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                          <div>
                            <h3 className="text-xl font-semibold text-white mb-2">
                              CryptoCollectibles
                            </h3>
                            <p className="text-sm text-indigo-200">
                              Rare digital collectibles platform
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-gradient-to-br from-teal-500/20 to-blue-500/20 border-white/10 overflow-hidden">
                    <CardContent className="p-0">
                      <div className="relative aspect-video overflow-hidden">
                        <img
                          alt="Collectibles NFT Marketplace"
                          className="object-cover w-full h-full transition-all duration-300 transform hover:scale-110"
                          height="300"
                          src="/placeholder.svg?height=300&width=400"
                          width="400"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                          <div>
                            <h3 className="text-xl font-semibold text-white mb-2">
                              VintageVault
                            </h3>
                            <p className="text-sm text-teal-200">
                              Classic collectibles reimagined as NFTs
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent
                  value="gaming"
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  <Card className="bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border-white/10 overflow-hidden">
                    <CardContent className="p-0">
                      <div className="relative aspect-video overflow-hidden">
                        <img
                          alt="Gaming NFT Marketplace"
                          className="object-cover w-full h-full transition-all duration-300 transform hover:scale-110"
                          height="300"
                          src="/placeholder.svg?height=300&width=400"
                          width="400"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                          <div>
                            <h3 className="text-xl font-semibold text-white mb-2">
                              GamersGuild
                            </h3>
                            <p className="text-sm text-blue-200">
                              In-game items and characters marketplace
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-gradient-to-br from-indigo-500/20 to-teal-500/20 border-white/10 overflow-hidden">
                    <CardContent className="p-0">
                      <div className="relative aspect-video overflow-hidden">
                        <img
                          alt="Gaming NFT Marketplace"
                          className="object-cover w-full h-full transition-all duration-300 transform hover:scale-110"
                          height="300"
                          src="/placeholder.svg?height=300&width=400"
                          width="400"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                          <div>
                            <h3 className="text-xl font-semibold text-white mb-2">
                              MetaverseMarket
                            </h3>
                            <p className="text-sm text-indigo-200">
                              Virtual real estate and assets exchange
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </div>
              <div className="mt-8 text-center">
                <Button className="bg-gradient-to-r from-blue-500 to-teal-400 hover:from-blue-600 hover:to-teal-500 text-white transition-all duration-300 ease-in-out transform hover:scale-105 rounded-full shadow-lg">
                  See More
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </Tabs>
          </div>
        </section>
        <section id="features" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-blue-300">
              Why Choose Easy 3?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center p-6 bg-gradient-to-br from-teal-500/20 to-blue-500/20 rounded-lg backdrop-blur-md border border-white/10 transition-all duration-300 hover:scale-105">
                <Zap className="h-12 w-12 text-yellow-400 mb-4" />
                <h3 className="text-xl font-bold mb-2 text-white">
                  Easy3 Builder
                </h3>
                <p className="text-teal-100">
                  Create your NFT marketplace without coding in just 3 easy
                  steps.
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-6 bg-gradient-to-br from-blue-500/20 to-teal-500/20 rounded-lg backdrop-blur-md border border-white/10 transition-all duration-300 hover:scale-105">
                <Box className="h-12 w-12 text-pink-400 mb-4" />
                <h3 className="text-xl font-bold mb-2 text-white">
                  Customizable Templates
                </h3>
                <p className="text-teal-100">
                  Choose from a variety of stunning templates and make them your
                  own.
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-6 bg-gradient-to-br from-indigo-500/20 to-teal-500/20 rounded-lg backdrop-blur-md border border-white/10 transition-all duration-300 hover:scale-105">
                <Globe className="h-12 w-12 text-purple-400 mb-4" />
                <h3 className="text-xl font-bold mb-2 text-white">
                  Global Reach
                </h3>
                <p className="text-teal-100">
                  Connect with NFT enthusiasts and collectors worldwide.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-blue-300">
              How It Works: Easy3 Steps
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center p-6 bg-gradient-to-br from-blue-500/20 to-teal-500/20 rounded-lg backdrop-blur-md border border-white/10">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-teal-400 text-white flex items-center justify-center text-2xl font-bold mb-4">
                  1
                </div>
                <h3 className="text-xl font-bold mb-2 text-white">
                  Choose Your Template
                </h3>
                <p className="text-teal-100">
                  Select from our range of professionally designed NFT
                  marketplace templates.
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-6 bg-gradient-to-br from-teal-500/20 to-blue-500/20 rounded-lg backdrop-blur-md border border-white/10">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-teal-400 to-blue-500 text-white flex items-center justify-center text-2xl font-bold mb-4">
                  2
                </div>
                <h3 className="text-xl font-bold mb-2 text-white">
                  Customize Your Marketplace
                </h3>
                <p className="text-teal-100">
                  Add your branding, configure settings, and curate your NFT
                  collections.
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-6 bg-gradient-to-br from-blue-500/20 to-teal-500/20 rounded-lg backdrop-blur-md border border-white/10">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-teal-400 text-white flex items-center justify-center text-2xl font-bold mb-4">
                  3
                </div>
                <h3 className="text-xl font-bold mb-2 text-white">
                  Launch and Grow
                </h3>
                <p className="text-teal-100">
                  Go live with your marketplace and start selling your NFTs to a
                  global audience.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section id="contact" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-white">
                  Ready to Launch Your NFT Marketplace?
                </h2>
                <p className="mx-auto max-w-[700px] text-teal-100 md:text-xl">
                  Join thousands of creators who are building the future of
                  digital ownership with Easy 3.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <Button
                  className="w-full bg-gradient-to-r from-blue-500 to-teal-400 hover:from-blue-600 hover:to-teal-500 text-white transition-all duration-300 ease-in-out transform hover:scale-105 text-lg py-6 rounded-full shadow-lg"
                  type="submit"
                >
                  Start Building Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
