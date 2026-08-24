import { env } from "@/config/env";
import axios from "axios";

export interface RefreshTokenResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
  };
}

export const getNewAccessToken = async (refreshToken?: string): Promise<{ success: boolean; data?: { accessToken: string } }> => {
  try {
    const response = await axios.post<RefreshTokenResponse>(
      `${env.apiUrl}/auth/refresh-token`,
      {},
      {
        withCredentials: true,
        headers: refreshToken ? { Cookie: `refreshToken=${refreshToken}` } : undefined,
      },
    );

    if (response.data?.success && response.data?.data) {
      const accessToken =
        typeof response.data.data === "string"
          ? response.data.data
          : response.data.data.accessToken;

      return {
        success: true,
        data: { accessToken },
      };
    }
  } catch {
    return { success: false };
  }

  return { success: false };
};