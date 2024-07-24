import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import {
  SIWESession,
  verifySignature,
  getChainIdFromMessage,
  getAddressFromMessage,
} from "@web3modal/siwe";
import {
  createUserWithReferral,
  trackReferralAndAwardPoints,
} from "@/handlers/referralHandler";
import { db } from "@/configs/firebaseAdmin";

declare module "next-auth" {
  interface Session extends SIWESession {
    address: string;
    chainId: number;
    referralCode?: string;
    asteroidPoints?: number;
    referralsCount?: number;
    accessToken?: string;
  }

  interface User {
    chainId: number;
    address: string;
    referralCode?: string;
    asteroidPoints?: number;
    referralsCount?: number;
  }
}

const nextAuthSecret = process.env.NEXTAUTH_SECRET;
if (!nextAuthSecret) {
  throw new Error("NEXTAUTH_SECRET is not set");
}
const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;
if (!projectId) {
  throw new Error("NEXT_PUBLIC_PROJECT_ID is not set");
}

interface UserData {
  referralCode?: string;
  asteroidPoints?: number;
  referralsCount?: number;
}

const providers = [
  CredentialsProvider({
    name: "Ethereum",
    credentials: {
      message: { label: "Message", type: "text", placeholder: "0x0" },
      signature: { label: "Signature", type: "text", placeholder: "0x0" },
      referralCode: {
        label: "Referral Code",
        type: "text",
        placeholder: "Optional referral code",
      },
    },
    async authorize(credentials) {
      try {
        if (!credentials?.message) {
          throw new Error("SiweMessage is undefined");
        }
        const { message, signature, referralCode } = credentials;
        const address = getAddressFromMessage(message);
        const chainId = getChainIdFromMessage(message);

        const isValid = await verifySignature({
          address,
          message,
          signature,
          chainId,
          projectId,
        });

        if (isValid) {
          const userRef = db.collection("users").doc(address);
          const userDoc = await userRef.get();

          let userReferralCode = "";
          let asteroidPoints = 0;
          let referralsCount = 0;

          if (!userDoc.exists) {
            console.log("User does not exist, creating a new one.");
            userReferralCode = await createUserWithReferral(address);
            await userRef.set({
              referralCode: userReferralCode,
              asteroidPoints,
              referralsCount,
            });
          } else {
            const userData = userDoc.data() as UserData;
            userReferralCode =
              userData?.referralCode || (await createUserWithReferral(address));
            asteroidPoints = userData?.asteroidPoints ?? 0;
            referralsCount = userData?.referralsCount ?? 0;

            // Update the user document if any field is missing
            const updateData: Partial<UserData> = {};
            if (!userData?.referralCode)
              updateData.referralCode = userReferralCode;
            if (userData?.asteroidPoints === undefined)
              updateData.asteroidPoints = asteroidPoints;
            if (userData?.referralsCount === undefined)
              updateData.referralsCount = referralsCount;
            if (Object.keys(updateData).length > 0) {
              await userRef.update(updateData);
              console.log("Updated missing user data fields: ", updateData);
            }

            console.log("Existing user found: ", {
              userReferralCode,
              asteroidPoints,
              referralsCount,
            });
          }

          if (referralCode) {
            console.log("Referral code provided: ", referralCode);
            await trackReferralAndAwardPoints(address, referralCode);

            const referrerRef = db
              .collection("users")
              .where("referralCode", "==", referralCode)
              .limit(1);
            const referrerDoc = await referrerRef.get();

            if (!referrerDoc.empty) {
              const referrerId = referrerDoc.docs[0].id;
              const referrerData = referrerDoc.docs[0].data() as UserData;
              const newReferralsCount = (referrerData?.referralsCount ?? 0) + 1;

              await db
                .collection("users")
                .doc(referrerId)
                .update({ referralsCount: newReferralsCount });
              console.log(
                "Updated referrer's referrals count: ",
                newReferralsCount
              );
            } else {
              console.log("No referrer found for the provided referral code.");
            }
          }

          return {
            id: `${chainId}:${address}`,
            address,
            chainId: Number(chainId),
            referralCode: userReferralCode,
            asteroidPoints,
            referralsCount,
          };
        } else {
          console.error("Signature verification failed.");
        }

        return null;
      } catch (e) {
        console.error("Authorization error: ", e);
        return null;
      }
    },
  }),
];

const handler = NextAuth({
  secret: nextAuthSecret,
  providers,
  session: { strategy: "jwt" },
  callbacks: {
    async session({ session, token }) {
      if (token.sub) {
        const [chainId, address] = token.sub.split(":");
        if (chainId && address) {
          session.address = address;
          session.chainId = parseInt(chainId, 10);
          session.referralCode = token.referralCode as string | undefined;
          session.asteroidPoints = token.asteroidPoints as number | undefined;
          session.referralsCount = token.referralsCount as number | undefined;
          session.accessToken = token.accessToken as string | undefined;
        }
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = `${user.chainId}:${user.address}`;
        token.referralCode = user.referralCode;
        token.asteroidPoints = user.asteroidPoints;
        token.referralsCount = user.referralsCount;
      }
      return token;
    },
  },
});

export { handler as GET, handler as POST };
