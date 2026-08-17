import jwt, { JwtPayload } from "jsonwebtoken";

export interface DecodedTokenResult {
  success: boolean;
  data?: JwtPayload | string | null;
  error?: string;
}

export const verifyToken = (token: string, secret?: string): DecodedTokenResult => {
  try {
    const verifiedToken = secret ? jwt.verify(token, secret) : jwt.decode(token);
    return {
      success: Boolean(verifiedToken),
      data: verifiedToken,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Token verification failed",
    };
  }
};

export const decodeToken = (token: string): JwtPayload | null => {
  try {
    const decoded = jwt.decode(token);
    return typeof decoded === "object" ? decoded : null;
  } catch {
    return null;
  }
};

export const jwtUtils = {
  verifyToken,
  decodeToken,
};