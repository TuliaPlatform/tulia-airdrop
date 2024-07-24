import { v4 as uuidv4 } from "uuid";

export const generateReferralCode = (): string => {
  return uuidv4();
};
