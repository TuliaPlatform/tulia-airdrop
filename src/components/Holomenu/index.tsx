"use client";

import React, { useState } from "react";
import NavButton from "@/components/NavButton/index";
import { IconMenu } from "@tabler/icons-react";
import { IconCoin } from "@tabler/icons-react";
import { IconListDetails } from "@tabler/icons-react";

const Icon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    fill="currentColor"
    className="bi bi-stack"
    viewBox="0 0 16 16"
  >
    <path d="m14.12 10.163 1.715.858c.22.11.22.424 0 .534L8.267 15.34a.6.6 0 0 1-.534 0L.165 11.555a.299.299 0 0 1 0-.534l1.716-.858 5.317 2.659c.505.252 1.1.252 1.604 0l5.317-2.66zM7.733.063a.6.6 0 0 1 .534 0l7.568 3.784a.3.3 0 0 1 0 .535L8.267 8.165a.6.6 0 0 1-.534 0L.165 4.382a.299.299 0 0 1 0-.535z" />
    <path d="m14.12 6.576 1.715.858c.22.11.22.424 0 .534l-7.568 3.784a.6.6 0 0 1-.534 0L.165 7.968a.299.299 0 0 1 0-.534l1.716-.858 5.317 2.659c.505.252 1.1.252 1.604 0z" />
  </svg>
);

const DropdownMenu = () => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="dropdown min-[768px]:hidden">
      <button className="w-full flex flex-1" onClick={toggleMenu}>
        <NavButton id="#menu" text="" icon={<IconMenu />} />
      </button>
      {isOpen && (
        <ul className="dropdown-menu">
          <li className="w-full flex flex-1 ">
            <NavButton
              id="#tulia-airdrop"
              text="Airdrop"
              icon={<IconCoin stroke={2} />}
            />
          </li>
          <li className="w-full flex flex-1 ">
            <div className="flex flex-col items-start text-xs gap-2">
              <NavButton
                id="#tulia-airdrop"
                text="Leaderboard"
                icon={<IconListDetails stroke={2} />}
              />
              <p className="bg-slate-700 w-full p-1 h-4 text-white font-semibold text-xs rounded-lg flex items-center justify-center">
                COMING SOON
              </p>
            </div>
          </li>
        </ul>
      )}
    </div>
  );
};

export default DropdownMenu;
