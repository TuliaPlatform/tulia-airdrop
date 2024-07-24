import React, { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import Card from "@/components/Card/Card";
import Invite from "@/components/InviteCard/Invite";
import HoverCard from "@/components/HoverCard/HoverCard";
import Cardfor from "@/components/Cardforpoints/Cardfor";
import { db } from "@/configs/firebase";
import { doc, getDoc } from "firebase/firestore";

const Quest = () => {
  const { data: session } = useSession();
  const [isTwitterCompleted, setIsTwitterCompleted] = useState(false);
  const [isDiscordCompleted, setIsDiscordCompleted] = useState(false);
  const [isTelegramCompleted, setIsTelegramCompleted] = useState(false);
  const [isLender, setIsLender] = useState(false);
  const [isBorrower, setIsBorrower] = useState(false);
  const [isDefaultLoan, setIsDefaultLoan] = useState(false);
  const [isCloseDeal, setIsCloseDeal] = useState(false);
  const [isRepayLoan, setIsRepayLoan] = useState(false);

  const fetchUserData = useCallback(async (walletAddress: string) => {
    try {
      const userDocRef = doc(db, "users", walletAddress);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();

        if (userData?.quests?.twitter === "completed") {
          setIsTwitterCompleted(true);
        }
        if (userData?.discord_id) {
          setIsDiscordCompleted(true);
        }
        if (userData?.telegram_id) {
          setIsTelegramCompleted(true);
        }
        if (userData?.quests?.createdPool) {
          setIsLender(true);
        }
        if (userData?.quests?.acceptLendRequest) {
          setIsBorrower(true);
        }
        if (userData?.quests?.defaultLoan) {
          setIsDefaultLoan(true);
        }
        if (userData?.quests?.closeDeal) {
          setIsCloseDeal(true);
        }
        if (userData?.quests?.repayLoan) {
          setIsRepayLoan(true);
        }
      } else {
        console.error("User document not found");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }, []);

  useEffect(() => {
    if (session) {
      const walletAddress = session?.address;
      if (walletAddress) {
        fetchUserData(walletAddress);
      }
    }
  }, [session, fetchUserData]);

  const handleOAuth = async () => {
    if (session) {
      try {
        const response = await fetch("/api/twitter/oauth", {
          method: "GET",
        });

        if (response.ok) {
          const data = await response.json();
          const newWindow = window.open(
            data.url,
            "_blank",
            "width=500,height=600"
          );
          if (newWindow) {
            newWindow.focus();
          } else {
            alert(
              "Please allow popups for this site to authenticate with Twitter."
            );
          }
        } else {
          console.error("Failed to get OAuth link");
        }
      } catch (error) {
        console.error("Error during OAuth process:", error);
      }
    } else {
      console.error("User session not found");
    }
  };

  const handleSwapClick = () => {
    const swapUrl = "https://app.tulia.finance";
    window.open(swapUrl, "_blank");
  };

  return (
    <div className="flex flex-col md:flex-row bg-transparent">
      <div id="your-score" className="flex-1 md:order-2">
        <h1 className="justify-center flex mb-16 text-4xl text-white">
          Profile
        </h1>
        <HoverCard />
        <div className="flex justify-center mt-16 mb-16 items-center">
          <Invite />
        </div>
        <div className="flex justify-center mt-16 mb-16 items-center">
          <Cardfor title="" description="" />
        </div>
      </div>
      <div id="card" className="flex-1 md:order-1">
        <h1 className="justify-center flex mb-8 text-4xl text-white">Quests</h1>
        <Card
          title="Daily Multichain Swap Frenzy"
          description="Engage in our daily challenge by swapping assets across multiple chains. Reach volume thresholds to unlock multipliers and amplify your rewards. More swaps, more gains!"
          participants="12k+ active swappers"
          point={`200/Min`}
          buttonTitle="Initiate Swap"
          onButtonClick={handleSwapClick}
          disabled={!session}
        />

        <Card
          title="Twitter Follow Fiesta"
          description="Follow us on Twitter to get the latest updates and participate in exclusive giveaways."
          participants="23k"
          point={"200"}
          buttonTitle={isTwitterCompleted ? "Completed" : "Twitter"}
          onButtonClick={handleOAuth}
          disabled={!session || isTwitterCompleted}
        />
        <Card
          title="Join Discord Community"
          description="Be part of our vibrant community on Discord and unlock exclusive rewards."
          participants="23k"
          point={"200"}
          buttonTitle={!session || isDiscordCompleted ? "Completed" : "Discord"}
          onButtonClick={() =>
            window.open("https://discord.com/invite/JxUnnzcAjk", "_blank")
          }
          disabled={!session}
        />
        <Card
          title="Say 'Hey' to our discord group/per day"
          description="Engage daily in our Discord to maintain active member status and gain rewards."
          participants="23k"
          point={"50"}
          buttonTitle="Discord"
          onButtonClick={() =>
            window.open("https://discord.com/invite/JxUnnzcAjk", "_blank")
          }
          disabled={!session}
        />
        <Card
          title="Telegram Engagement Boost"
          description="Join our Telegram for real-time updates and direct support from the team."
          participants="23k"
          point={"200"}
          buttonTitle={
            !session || isTelegramCompleted ? "Completed" : "Telegram"
          }
          onButtonClick={() =>
            window.open("https://t.me/TuliaAirdropBot", "_blank")
          }
          disabled={!session}
        />
        <Card
          title="Referral Rally"
          description="Refer a friend and both earn points. Help us grow our community and earn rewards together!"
          participants=""
          point={"300"}
          buttonTitle="Refer"
          onButtonClick={() => console.log("")}
          disabled={!session}
        />
        <Card
          title="Launch Your First Tulia Pool/per day"
          description="Set up your first Tulia pool on testnet to start learning! Complete this quest to explore lending dynamics and simulate rewards. Perfect for testing platform functionalities without real-world stakes."
          point={"300"}
          participants=""
          buttonTitle={isLender ? "Completed" : "Start Lending"}
          onButtonClick={() => handleSwapClick()}
          disabled={!session || isLender}
        />

        <Card
          title="Join as a Borrower/per day"
          description="Looking to simulate borrowing? Accept a test lending offer to understand the borrowing process and earn virtual points!"
          point={"300"}
          participants=""
          buttonTitle={isBorrower ? " Completed" : "Become Borrower"}
          onButtonClick={() => handleSwapClick()}
          disabled={!session || isBorrower}
        />

        <Card
          title="Experience a Default/per day"
          description="Use this testnet quest to explore the consequences of a loan default in a controlled environment. Learn about risk management and earn virtual points for completing this challenge."
          point={"300"}
          participants=""
          buttonTitle={isDefaultLoan ? "Completed" : "Default on a Loan"}
          onButtonClick={() => handleSwapClick()}
          disabled={!session || isDefaultLoan}
        />

        <Card
          title="Seal the Deal/per day"
          description="Close a deal on testnet to test transactional dynamics and reward mechanisms. This quest helps you understand deal closure in a risk-free environment!"
          point={"300"}
          participants=""
          buttonTitle={isCloseDeal ? "Completed" : "Close the Deal"}
          onButtonClick={() => handleSwapClick()}
          disabled={!session || isCloseDeal}
        />

        <Card
          title="Fulfill Your Commitment/per day"
          description="Simulate loan repayment on testnet to demonstrate how Tulia handles repayments. Earn virtual points and provide valuable feedback on our repayment processes!"
          point={"300"}
          participants=""
          buttonTitle={isRepayLoan ? "Completed" : "Repay Loan"}
          onButtonClick={() => handleSwapClick()}
          disabled={!session || isRepayLoan}
        />
      </div>
    </div>
  );
};

export default Quest;
