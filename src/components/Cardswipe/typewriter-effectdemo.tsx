"use client";
import { TypewriterEffect } from "./typewriter-effect";

export function TypewriterEffectDemo() {
  const words = [
    {
      text: "exclusive",
    },
    {
      text: "opportunity",
    },
    {
      text: "to",
    },
    {
      text: "earn",
    },
    {
      text: "Tuliacoin!",
      className: "text-blue-500",
    },
  ];
  return (
    <div className="flex flex-col items-center justify-center h-[40rem] ">
      <p className="text-neutral-200 text-base  mb-5">
        Join our community and be part of the future of DeFi.
      </p>
      <TypewriterEffect words={words} />
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 space-x-0 md:space-x-4 mt-5">
        <button className="w-40 h-10 rounded-xl bg-white  border-black border-transparent text-black text-sm">
          App
        </button>
        <button className="w-40 h-10 rounded-xl bg-white text-black border border-black  text-sm">
          LeaderBoard
        </button>
      </div>
    </div>
  );
}
