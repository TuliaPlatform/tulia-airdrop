// /app/layout.tsx
import { Inter } from "next/font/google";
import "./globals.css";
import { Metadata } from "next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Tulia Protocol - Airdrop",
  description:
    "Join the Tulia Protocol airdrop and revolutionize your crypto lending experience. Earn more, make you rich, and change the DeFi ecosystem!",
  keywords:
    "decentralized lending, personalized interest rates, peer-to-peer lending, defi, crypto, blockchain, arbitrum, ethereum, free crypto, crypto lending, make you rich, smart contracts, financial technology, fintech, digital assets, lending platform, borrowing platform, yield farming, staking, liquidity pools, interest rates, financial services, blockchain technology, crypto rewards, decentralized applications, airdrop, crypto airdrop, decentralized exchanges, crypto finance, free money",
  openGraph: {
    title: "Tulia Protocol - Airdrop",
    description:
      "Join the Tulia Protocol airdrop and revolutionize your crypto lending experience. Earn more, make you rich, and change the DeFi ecosystem!",
    images: [
      {
        url: "/logo.ico",
        width: 800,
        height: 600,
        alt: "Tulia Protocol Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@TuliaProtocol",
    title: "Tulia Protocol - Airdrop",
    description:
      "Join the Tulia Protocol airdrop and revolutionize your crypto lending experience. Earn more, make you rich, and change the DeFi ecosystem!",
    images: "/logo2.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
      <link rel="icon" href="/logo.ico" sizes="any" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
