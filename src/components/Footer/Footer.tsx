import React from "react";
import {
  IconBrandX,
  IconBrandDiscord,
  IconBrandTelegram,
  IconBrandLinkedin,
  IconBrandMedium,
} from "@tabler/icons-react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="grid grid-cols-12 px-10 py-10 bg-grid-white/[0.01]">
      <div className="col-span-3 col-start-3">
        <h1 className="text-1xl md:text-2xl font-bold text-white">Tulia</h1>
        <p className="text-white text-left max-w-[520px] text-xs mt-4">
          Our aim is to innovate the lending scape with the Tulia community.
        </p>
      </div>
      <div className="col-span-3 col-start-7">
        <div className="flex flex-col gap-2 mt-4"></div>
      </div>
      <div className="col-span-3 col-start-10">
        <h1 className="text-1xl  md:text-2xl font-bold text-white">Socials</h1>
        <div className="flex flex-col gap-2 mt-4">
          <Link
            href="
            https://x.com/tuliaprotocol"
            target="_blank"
            className="text-white text-lg hover:text-indigo-500 transition-all duration-300 ease"
          >
            <IconBrandX stroke={2} />
          </Link>
          <Link
            href="https://www.linkedin.com/company/tulias/"
            target="_blank"
            className="text-white text-lg hover:text-indigo-500 transition-all duration-300 ease"
          >
            <IconBrandLinkedin stroke={2} />
          </Link>
          <Link
            href="https://discord.gg/JxUnnzcAjk"
            target="_blank"
            className="text-white text-lg hover:text-indigo-500 transition-all duration-300 ease"
          >
            <IconBrandDiscord stroke={2} />
          </Link>
          <Link
            href="https://t.me/tulia_finance"
            target="_blank"
            className="text-white text-lg hover:text-indigo-500 transition-all duration-300 ease"
          >
            <IconBrandTelegram stroke={2} />
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;