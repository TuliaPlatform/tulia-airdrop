import { NextRequest, NextResponse } from "next/server";
import { trackReferralAndAwardPoints } from "../../../handlers/referralHandler";

export async function POST(req: NextRequest) {
  try {
    const { address, referralCode } = await req.json();

    if (!address || !referralCode) {
      return NextResponse.json(
        { message: "Address or referral code is missing" },
        { status: 400 }
      );
    }

    await trackReferralAndAwardPoints(address, referralCode);
    return NextResponse.json({ message: "Referral processed successfully" });
  } catch (error) {
    console.error("Error processing referral:", error);
    return NextResponse.json(
      { message: "Error processing referral" },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return NextResponse.json({});
}
