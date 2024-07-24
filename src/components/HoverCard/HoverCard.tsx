import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useAccount } from "wagmi";
import { db } from "@/configs/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import Image from "next/image";
import { BackgroundGradient } from "../BackgroundGradient/backgroundgradient";

const HoverCard = () => (
  <section className="bg-transparent">
    <div className="mx-auto w-fit">
      <Card />
    </div>
  </section>
);

const Card = () => {
  const { data: session, status } = useSession();
  const account = useAccount();

  const [asteroidPoints, setAsteroidPoints] = useState(0);
  const [profilename, setProfileName] = useState("Not connected");

  useEffect(() => {
    if (account?.address) {
      setProfileName(account.address.substring(0, 8));
      const userDocRef = doc(db, "users", account.address);

      const unsubscribe = onSnapshot(userDocRef, (doc) => {
        if (doc.exists()) {
          const userData = doc.data() as { asteroidPoints: number };
          setAsteroidPoints(userData.asteroidPoints || 0);
        } else {
          console.error("User document not found");
        }
      });

      // Cleanup listener on component unmount
      return () => unsubscribe();
    } else {
      setProfileName("Not connected");
      setAsteroidPoints(0);
    }
  }, [account]);

  return (
    <BackgroundGradient className="rounded-[4px]">
      <div className="relative h-60 w-90 shrink-0 overflow-hidden rounded-xl border border-white/[0.4] bg-black p-8">
        <div className="relative z-10 text-white">
          <span className="my-2 block origin-top-mid font-mono text-4xl font-black leading-[1.2]">
            <div className="rounded-xl flex items-center max-[376px]:w-40 w-60 max-w-60 max-h-50 border border-white/[0.4] p-2">
              <div className="text-xs">{profilename}</div>
              {account?.address && (
                <div className="flex-grow text-center">
                  <div className="ml-10">
                    <Image
                      src="/Pioneerr.png"
                      width={35}
                      height={35}
                      alt="Asteroid logo"
                      className="mr-2"
                    />
                  </div>
                </div>
              )}
              {account?.address && (
                <div className="text-xs text-right">
                  <span className="font-extrabold">Pioneer</span>
                  <p>Tier</p>
                </div>
              )}
            </div>
            <br />
          </span>

          <div className="flex flex-col -gap-3 items-center mx-3">
            <div className="flex items-center ">
              <div className="flex items-center">
                <Image
                  src="/astreoidpoint.png"
                  width={30}
                  height={30}
                  alt="Asteroid logo"
                  className="mr-2"
                />
              </div>
              <div className="flex items-center">
                <span className="text-lg font-bold text-white sm:text-2xl">
                  {asteroidPoints.toString().slice(0, 8)}
                </span>
              </div>
            </div>
            <div className="text-lg text-gray-400 font-extrabold text-center mb-2">
              Asteroid
            </div>
          </div>
        </div>
      </div>
    </BackgroundGradient>
  );
};

export default HoverCard;
