"use client";
import React from "react";
import NavButton from "../NavButton";
import { IconListDetails, IconNotebook, IconRocket } from "@tabler/icons-react";

const Navbar = () => {
  return (
    <nav>
      <div className="w-full flex gap-2 justify-start">
        <NavButton
          id="https://app.tulia.finance"
          text="Testnet App"
          icon={<IconRocket stroke={2} />}
          isExternal={true}
        />
        <div className="flex items-center pr-2">
          <NavButton
            id="#leaderboard"
            text="Leaderboard"
            icon={<IconListDetails stroke={2} />}
          />
          <p className="bg-slate-700 w-24 p-1 h-4 text-white font-semibold text-[0.65rem] rounded-lg flex items-center justify-center">
            COMING SOON
          </p>
        </div>
        <div className="flex items-center pr-2">
          {" "}
          <NavButton
            id="https://docs.tulia.finance"
            text="Docs"
            icon={<IconNotebook stroke={2} />}
            isExternal={true}
          />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
