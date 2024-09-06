"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useAnimation } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRight, Box, Zap, Globe, Wallet } from "lucide-react";

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
          <a
            className="text-sm font-medium text-white hover:text-teal-300 transition-colors"
            href="#showcase"
          >
            Showcase
          </a>
          <a
            className="text-sm font-medium text-white hover:text-teal-300 transition-colors"
            href="#features"
          >
            Features
          </a>
          <a
            className="text-sm font-medium text-white hover:text-teal-300 transition-colors"
            href="#how-it-works"
          >
            How It Works
          </a>
          <a
            className="text-sm font-medium text-white hover:text-teal-300 transition-colors"
            href="#contact"
          >
            Contact
          </a>
          <Button className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-blue-500 to-teal-400 hover:from-blue-600 hover:to-teal-500 text-white transition-all duration-300 ease-in-out transform hover:scale-105">
            <Wallet className="h-4 w-4" />
            Connect Wallet
          </Button>
        </nav>
      </header>
      <main className="flex-1">
        <AwesomeE3Design />
      </main>
    </div>
  );
}
