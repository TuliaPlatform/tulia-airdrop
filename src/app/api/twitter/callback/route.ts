// pages/api/twitter/callback.ts

import { NextRequest, NextResponse } from "next/server";
import { TwitterApi } from "twitter-api-v2";
import { getToken } from "next-auth/jwt";
import { db } from "@/configs/firebaseAdmin";

const twitterClient = new TwitterApi({
  clientId: process.env.TWITTER_CLIENT_ID!,
  clientSecret: process.env.TWITTER_CLIENT_SECRET!,
});

export async function GET(request: NextRequest) {
  const stateCookie = request.cookies.get("twitter_oauth_state");
  const codeVerifierCookie = request.cookies.get("twitter_code_verifier");

  const state = stateCookie ? stateCookie.value : null;
  const codeVerifier = codeVerifierCookie ? codeVerifierCookie.value : null;


  if (!state || !codeVerifier) {
    return NextResponse.json(
      { error: "Invalid state or code verifier" },
      { status: 400 }
    );
  }

  try {
    const code = request.nextUrl.searchParams.get("code");
    if (!code) {
      return NextResponse.json(
        { error: "Code not found in query parameters" },
        { status: 400 }
      );
    }
    console.log("Received code:", code);

    const { client: loggedClient, accessToken } =
      await twitterClient.loginWithOAuth2({
        code,
        codeVerifier,
        redirectUri: process.env.TWITTER_REDIRECT_URI!,
      });

    const { data: userData } = await loggedClient.v2.me();

    // Extract wallet address from JWT token
    const token = await getToken({ req: request });
    const walletAddress = token?.sub?.split(":")[1];
    if (!walletAddress) {
      return NextResponse.json(
        { error: "Wallet address is missing or malformed" },
        { status: 400 }
      );
    }

    // Check if the user has already completed the Twitter follow quest
    const userRef = db.collection("users").doc(walletAddress);
    const userDoc = await userRef.get();
    const userDataInDb = userDoc.data();

    if (userDataInDb?.quests?.twitter === "completed") {
      return NextResponse.redirect("https://airdrop.tulia.finance/");
    }

    // Update user data in Firestore
    const newAsteroidPoints = (userDataInDb?.asteroidPoints || 0) + 200;
    await userRef.set(
      {
        twitterAccessToken: accessToken,
        twitterUsername: userData.username,
        twitterId: userData.id,
        asteroidPoints: newAsteroidPoints,
        quests: {
          ...userDataInDb?.quests,
          twitter: "completed",
        },
      },
      { merge: true }
    );

    const twitterPageUrl =
      "https://x.com/intent/follow?screen_name=tuliaprotocol";
    return NextResponse.redirect(twitterPageUrl);
  } catch (error) {
    console.error("Error in callback:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
