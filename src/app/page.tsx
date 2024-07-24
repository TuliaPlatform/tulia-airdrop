"use client";
import Image from "next/image";
import Header from "@/components/Header/index";
import Quest from "@/components/Sections/Quest";
import Footer from "@/components/Footer/Footer";
import { AuroraHero } from "@/components/AuroraHero/AuororaHero";
import { TypewriterEffectDemo } from "@/components/Cardswipe/typewriter-effectdemo";
import ClientProviders from "@/app/clientLayout";

export default function Home() {
  return (
    <ClientProviders>
      <>
        <Header />
        {/* <Image src="/bg.png" layout="fill" alt="Tulia" objectFit="cover" /> */}
        <main>
          <section
            className=" rounded px-6 py-20 bg-grid-white/[0.04]
      "
          >
            <AuroraHero />
          </section>
          <div className="flex flex-col">
            <section
              id="tulia-airdrop"
              className=" px-12 py-12 bg-grid-white/[0.04]"
            >
              <Quest />
            </section>
          </div>
        </main>
        <Footer />
      </>
    </ClientProviders>
  );
}
