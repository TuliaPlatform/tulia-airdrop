// pages/api/twitter/oauth.ts

import { NextRequest, NextResponse } from "next/server";
import { TwitterApi } from "twitter-api-v2";

const twitterClient = new TwitterApi({
  clientId: process.env.TWITTER_CLIENT_ID!,
  clientSecret: process.env.TWITTER_CLIENT_SECRET!,
});

export async function GET(request: NextRequest) {
  try {
    const { url, state, codeVerifier } = twitterClient.generateOAuth2AuthLink(
      process.env.TWITTER_REDIRECT_URI!,
      { scope: ["tweet.read", "tweet.write", "users.read", "follows.read"] }
    );

    const response = NextResponse.json({ url });
    response.cookies.set("twitter_oauth_state", state, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
    });
    response.cookies.set("twitter_code_verifier", codeVerifier, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Error in OAuth initialization:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
