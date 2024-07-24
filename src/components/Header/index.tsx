"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar/index";
import Link from "next/link";
import DropdownMenu from "@/components/Holomenu/index";
import CustomConnectButton from "../CustomConnect/CustomConnectButton";

const Header: React.FC = () => {
  return (
    <nav className="sticky top-5 h-0 z-30 w-full">
      <div className="w-full flex items-center justify-between pl-4 pr-8 rounded-full backdrop-filter backdrop-blur-lg max-w-7xl mx-auto bg-opacity-0">
        <Link href={"https://tulia.finance/"} target="_blank">
          <Image
            className="max-[812px]:hidden"
            src="/logo2.png"
            width={75}
            height={75}
            alt="Tulia"
          />
        </Link>
        <div className="flex items-center lg:flex md:flex max-[812px]:hidden ">
          <Navbar />
        </div>
        <div className="container flex-1">
          <DropdownMenu />
        </div>
        <div className="max-[414px]:hidden mr-3 bg-clip-text text-sm font-bold text-white ">
          Testnet v1.0.0
        </div>
        <div>
          <CustomConnectButton />
        </div>
      </div>
    </nav>
  );
};

export default Header;
