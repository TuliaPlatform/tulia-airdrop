import React, { useEffect, useState } from "react";
import { BackgroundGradient } from "../BackgroundGradient/backgroundgradient";
import { IconSeparator } from "@tabler/icons-react";
import { useSession } from "next-auth/react";
import { db } from "@/configs/firebase"; // Ensure the path is correct
import { doc, getDoc } from "firebase/firestore";
import { useAccount } from "wagmi";

interface ICardProps {
  title: string;
  description: string;
}

interface IUser {
  address: string;
  asteroidPoints: number;
  chainId: string;
  createdAt: Date;
  dailyTransactionVolume: number;
  discord_id: string;
  fromAmountUSD: string;
  last_reward: Date;
  quests: Record<string, any>;
  createdPool: Record<string, any>;
  completed: boolean;
  lastRewardTimestamp: number;
  discord: boolean;
  referral: string;
  telegram: boolean;
  referralCode: string;
  referralsCount: number;
  telegram_id: number;
  timestamp: number;
  transactionVolume: number;
}

const initialSwapThresholdArr = [
  { name: "$50 >", multiplier: 1.25, isAvailable: false },
  { name: "$10,000 >", multiplier: 1.5, isAvailable: false },
  { name: "$100,000 >", multiplier: 1.75, isAvailable: false },
  { name: "$500,000 >", multiplier: 2, isAvailable: false },
  { name: "$1,000,000 >", multiplier: 3.0, isAvailable: false },
];

const CardForDailyTransaction: React.FC<ICardProps> = () => {
  const { data: session } = useSession();
  const [user, setUser] = useState<IUser | null>(null);
  const [currentMultiplier, setCurrentMultiplier] = useState<number>(1);
  const [swapThresholdArr, setSwapThresholdArr] = useState(
    initialSwapThresholdArr
  );
  const account = useAccount();

  useEffect(() => {
    const fetchUserData = async () => {
      if (session && session.user && session.address) {
        const userRef = doc(db, "users", session.address);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          const userData = userDoc.data() as IUser;
          setUser(userData);
          calculateMultiplier(userData.dailyTransactionVolume);
        }
      }
    };

    fetchUserData();
  }, [session]);

  const calculateMultiplier = (volume: number) => {
    let multiplier = 1;
    const updatedThresholds = initialSwapThresholdArr.map((threshold) => {
      const minValue = parseFloat(threshold.name.replace(/[$, >]/g, ""));
      const isAvailable = volume >= minValue;
      if (isAvailable) {
        multiplier = threshold.multiplier;
      }
      return { ...threshold, isAvailable };
    });
    setSwapThresholdArr(updatedThresholds);
    setCurrentMultiplier(multiplier);
  };

  return (
    <>
      {account?.address && (
        <BackgroundGradient className="rounded-[4px]">
          <div className="relative w-90 flex flex-col items-center justify-center shrink-0 overflow-hidden rounded-xl border border-white/[0.4] bg-black p-8">
            <h2 className="text-white text-center font-semibold pb-4">
              Earn points by swapping more
            </h2>
            <div className="grid grid-cols-12 items-center justify-center w-full gap-2">
              {swapThresholdArr.map((item, index) => (
                <div
                  key={index}
                  className={`flex flex-col items-center col-span-6 justify-between w-full px-4 py-2 bg-black/[0.4] border rounded-[4px] ${
                    item.isAvailable
                      ? "border-primary bg-primary/50 font-semibold text-white"
                      : "border-white/[0.4]  !text-white/[0.4] font-normal"
                  } ${
                    index === swapThresholdArr.length - 1 ? "col-span-12" : ""
                  }`}
                >
                  <span className="">{item.name}</span>
                  <span className="">{item.multiplier}x</span>
                </div>
              ))}
            </div>
            <IconSeparator className="text-white mt-4" />
            <div className="flex flex-col items-center justify-center w-full gap-2 mt-4">
              <div className="flex items-center justify-between w-full px-4 py-2 rounded-[4px] bg-primary/50">
                <span className="text-white font-bold">Current Multiplier</span>
                <span className="text-white font-bold">
                  {currentMultiplier}x
                </span>
              </div>
              {user && (
                <div className="flex items-center justify-between w-full px-4 py-2 rounded-[4px] bg-primary/50">
                  <span className="text-white font-bold">
                    Daily Transaction Volume
                  </span>
                  <span className="text-white font-bold ml-2">
                    ${user.dailyTransactionVolume || 0}
                  </span>
                </div>
              )}
            </div>
          </div>
        </BackgroundGradient>
      )}
    </>
  );
};

export default CardForDailyTransaction;
