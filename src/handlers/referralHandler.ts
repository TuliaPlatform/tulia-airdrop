import { db, admin } from "../configs/firebaseAdmin"; // Ensure the path is correct
import { v4 as uuidv4 } from "uuid";
import { Transaction } from "@google-cloud/firestore"; // Import types from Firestore

export const generateReferralCode = (): string => {
  return uuidv4();
};

export const createUserWithReferral = async (address: string) => {
  const referralCode = generateReferralCode();
  const ref = db.collection("users").doc(address);
  await ref.set(
    {
      referralCode,
      asteroidPoints: 0,
      quests: {},
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    },
    { merge: true }
  );
  return referralCode;
};

export const trackReferralAndAwardPoints = async (
  referredAddress: string,
  referralCode: string
) => {
  try {
    // Log the received referral code
    console.log(`Received referral code: ${referralCode}`);

    const referralRef = db
      .collection("users")
      .where("referralCode", "==", referralCode)
      .limit(1);
    const referralDocs = await referralRef.get();

    if (referralDocs.empty) {
      console.log("Referral code not found in the database.");
      throw new Error("Invalid referral code");
    }

    const referrerDoc = referralDocs.docs[0];
    const referrerAddress = referrerDoc.id;

    if (referredAddress === referrerAddress) {
      console.log("Referred address is the same as the referrer address.");
      throw new Error("You cannot use your own referral code");
    }

    const userRef = db.collection("users").doc(referredAddress);
    const referrerRef = db.collection("users").doc(referrerAddress);

    await db.runTransaction(async (transaction: Transaction) => {
      const userDoc = await transaction.get(userRef);
      const referrerDoc = await transaction.get(referrerRef);

      if (!userDoc.exists || !referrerDoc.exists) {
        console.log("User or referrer document does not exist.");
        throw new Error("User or referrer does not exist");
      }

      const userData = userDoc.data();
      if (userData?.quests?.referral === "completed") {
        console.log("Referral quest already completed by this user.");
        throw new Error("Referral quest already completed");
      }

      const newUserPoints = (userData?.asteroidPoints || 0) + 300;
      const newReferrerPoints = (referrerDoc.data()?.asteroidPoints || 0) + 300;
      const newReferralsCount = (referrerDoc.data()?.referralsCount || 0) + 1;

      transaction.update(userRef, {
        asteroidPoints: newUserPoints,
        "quests.referral": "completed",
      });
      transaction.update(referrerRef, {
        asteroidPoints: newReferrerPoints,
        referralsCount: newReferralsCount,
      });

      console.log("Transaction successful. Points and referral count awarded.");
    });
  } catch (error) {
    console.error("Error in trackReferralAndAwardPoints:", error);
    throw new Error(`Referral processing failed: error`);
  }
};
