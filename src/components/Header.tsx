"use client";

import React, { useState } from "react";
import { Button } from "./ui/button";
import { Wallet } from "lucide-react";
import Link from "next/link";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
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
  return (
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
          href="/hcs"
          className="text-sm font-medium text-white hover:text-teal-300 transition-colors"
        >
          HCS
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
  );
};

export default Header;
