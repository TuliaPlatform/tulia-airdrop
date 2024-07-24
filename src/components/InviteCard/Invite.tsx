import { useSession } from "next-auth/react";
import { BackgroundGradient } from "../BackgroundGradient/backgroundgradient";
import { useEffect, useState } from "react";
import { IconCopy, IconUsers } from "@tabler/icons-react";
import { Input } from "../Input/Input";
import { cn } from "@/utils/cn";
import { db } from "@/configs/firebase";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { useAccount } from "wagmi";

const ReferralCard = () => (
  <section className="bg-transparent">
    <div className="mx-auto w-fit">
      <Card />
    </div>
  </section>
);

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};

const Card = () => {
  const { data: session, status } = useSession();
  const [copySuccess, setCopySuccess] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [uiReferralCode, setUIReferralCode] = useState("");
  const [message, setMessage] = useState("");
  const [referralCount, setReferralCount] = useState(0);
  const account = useAccount();
  interface UserData {
    referralCode: string;
    referralsCount: number;
  }

  const fetchUserData = async (walletAddress: string): Promise<void> => {
    try {
      const userDocRef = doc(db, "users", walletAddress);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data() as UserData;
        setUIReferralCode(userData.referralCode || "");
        setReferralCount(userData.referralsCount || 0);
      } else {
        console.error("User document not found");
      }
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    }
  };

  useEffect(() => {
    if (session?.address) {
      fetchUserData(session.address);
    }
  }, [session]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (session?.address) {
        fetchUserData(session.address);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [session]);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const copyToClipboard = () => {
    if (uiReferralCode) {
      navigator.clipboard
        .writeText(uiReferralCode)
        .then(() => {
          setCopySuccess("Copied successfully!");
          setTimeout(() => setCopySuccess(""), 3000);
        })
        .catch(() => setCopySuccess("Failed to copy!"));
    }
  };

  const handleReferralSubmit = async () => {
    if (referralCode && session?.address) {
      if (referralCode !== session.referralCode) {
        try {
          const response = await fetch("/api/referral", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ address: session.address, referralCode }),
          });

          if (response.ok) {
            setMessage(
              "Referral processed! You've been awarded 300 asteroid points."
            );
          } else {
            const data = await response.json();
            switch (data.message) {
              case "Invalid referral code":
                setMessage("The referral code you entered is invalid.");
                break;
              case "You cannot use your own referral code":
                setMessage("You cannot use your own referral code.");
                break;
              case "Referral quest already completed":
                setMessage("You have already completed the referral quest.");
                break;
              case "User or referrer does not exist":
                setMessage("User or referrer does not exist.");
                break;
              default:
                setMessage("Referral quest already completed");
            }
          }
        } catch (error) {
          setMessage("Error processing referral. Please try again later.");
          console.error("Error tracking referral:", error);
        }
      } else {
        setMessage("You cannot use your own referral code.");
      }
    } else {
      setMessage("Please enter a valid referral code.");
    }
  };

  const displayCode = account?.address
    ? `Referral Code: ${uiReferralCode.substring(0, 6)}`
    : "Sign in to get referral code";

  return (
    <BackgroundGradient className="rounded-[4px]">
      <div className="relative w-90 items-center justify-center shrink-0 overflow-hidden rounded-xl border border-white/[0.4] bg-black p-8">
        <div className="relative z-10 text-white flex flex-col items-center">
          <div className="flex items-center justify-center"></div>
          <div className="text-lg font-bold"></div>
          <button
            onClick={copyToClipboard}
            className="flex items-center rounded-md justify-center gap-2 bg-black text-white px-4 border border-white/[0.4] py-2  font-bold hover:bg-primary/50 transition-all duration-300 ease-in-out"
          >
            {copySuccess ? copySuccess : displayCode}
            {account?.address && !copySuccess && (
              <IconCopy stroke={2} className="ml-2" />
            )}
          </button>
          {account?.address ? (
            <LabelInputContainer className="mt-3">
              <Input
                id="ref"
                placeholder="Enter referral code"
                type="text"
                value={referralCode}
                onChange={(e) => setReferralCode(e.target.value)}
                onButtonClick={handleReferralSubmit}
              />
            </LabelInputContainer>
          ) : (
            <div></div>
          )}
          {message && <p className="mt-2 text-xs text-white">{message}</p>}
          {account?.address && (
            <div className="bg-black text-white rounded-md mt-2 flex items-center px-4 py-2 border border-white/[0.4]">
              Referrals: {referralCount}{" "}
              <IconUsers stroke={2} className="ml-2" />
            </div>
          )}{" "}
        </div>{" "}
      </div>
    </BackgroundGradient>
  );
};

export default ReferralCard;
