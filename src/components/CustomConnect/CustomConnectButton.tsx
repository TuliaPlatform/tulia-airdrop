"use client";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useAccount } from "wagmi";

const CustomConnectButton = () => {
  const { open } = useWeb3Modal();
  const account = useAccount();

  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (account?.address !== undefined || account.status === "reconnecting") {
      setConnected(true);
    } else {
      setConnected(false);
    }
  }, [account]);

  return (
    <div style={{ display: "flex", justifyContent: "flex-end", padding: 12 }}>
      {!connected ? (
        <Button
          variant={"outline"}
          className="hover:bg-violet-500/30 text-white"
          onClick={() => open({ view: "Connect" })}
        >
          Connect Wallet
        </Button>
      ) : (
        <div style={{ display: "flex", gap: 9 }}>
          {" "}
          <w3m-account-button />
        </div>
      )}
    </div>
  );
};

export default CustomConnectButton;
