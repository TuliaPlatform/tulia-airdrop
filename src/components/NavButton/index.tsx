"use client";
import React from "react";
import Link from "next/link";

interface NavButtonProps {
  id: string;
  text: string;
  icon: any;
  isExternal?: boolean;
}

const NavButton: React.FC<NavButtonProps> = ({
  id,
  text,
  icon,
  isExternal = false,
}) => {
  if (isExternal) {
    return (
      <a
        href={id}
        target="_blank"
        rel="noopener noreferrer"
        className="relative px-8 py-1 overflow-hidden font-medium text-sm text-white bg-transparent rounded-md shadow-inner group"
      >
        <span className="absolute top-0 left-0 w-0 h-0 transition-all duration-200 group-hover:w-full ease"></span>
        <span className="absolute bottom-0 right-0 w-0 h-0 transition-all duration-200 group-hover:w-full ease"></span>
        <span className="absolute top-0 left-0 w-full h-0 transition-all duration-300 delay-200 group-hover:h-full ease"></span>
        <span className="absolute bottom-0 left-0 w-full h-0 transition-all duration-300 delay-200 group-hover:h-full ease"></span>
        <span className="absolute inset-0 w-full h-full duration-300 delay-300 opacity-0 group-hover:opacity-100"></span>
        <span className="relative flex gap-2 hover:font-semibold items-center transition-colors duration-300 delay-200 group-hover:text-white ease">
          {icon} {text}
        </span>
      </a>
    );
  }

  return (
    <Link href={id} legacyBehavior>
      <a className="relative px-8 py-1 overflow-hidden font-medium text-sm text-white bg-transparent rounded-md shadow-inner group">
        <span className="absolute top-0 left-0 w-0 h-0 transition-all duration-200 group-hover:w-full ease"></span>
        <span className="absolute bottom-0 right-0 w-0 h-0 transition-all duration-200 group-hover:w-full ease"></span>
        <span className="absolute top-0 left-0 w-full h-0 transition-all duration-300 delay-200 group-hover:h-full ease"></span>
        <span className="absolute bottom-0 left-0 w-full h-0 transition-all duration-300 delay-200 group-hover:h-full ease"></span>
        <span className="absolute inset-0 w-full h-full duration-300 delay-300 opacity-0 group-hover:opacity-100"></span>
        <span className="relative flex gap-2 hover:font-semibold items-center transition-colors duration-300 delay-200 group-hover:text-white ease">
          {icon} {text}
        </span>
      </a>
    </Link>
  );
};

export default NavButton;
