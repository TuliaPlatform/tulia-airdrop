// /app/ClientProviders.tsx
"use client";

import { SessionProvider } from "next-auth/react";
import { Providers } from "../providers/wagmiProvider";
import { GoogleAnalytics } from "@next/third-parties/google";

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <Providers>{children}</Providers>
      <GoogleAnalytics gaId="G-MK95TFT1EJ" />
    </SessionProvider>
  );
}
