import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { jwtDecode } from "jwt-decode";
import { userLogin } from "../interfaces/user";

dotenv.config();
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET as string;
if (!ACCESS_TOKEN_SECRET) {
  throw new Error(
    "ACCESS_TOKEN_SECRET is not defined in the environment variables"
  );
}
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET as string;
if (!REFRESH_TOKEN_SECRET) {
  throw new Error(
    "REFRESH_TOKEN_SECRET is not defined in the environment variables"
  );
}

export function generateAccessToken(user: userLogin) {
  return jwt.sign(user, ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
}

export function generateRefreshToken(user: userLogin) {
  //expires after 7 days
  return jwt.sign(user, REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
}

export function verifyRefreshToken(refreshToken: string): string | null {
  try {
    const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET) as userLogin;
    return generateRefreshToken(decoded);
  } catch (error) {
    console.log("error inverifyRefreshToken ", error);

    return null;
  }
}
