"use server";

import { api } from "@/lib/axios";
import { cookies } from "next/headers";

type LoginActionState = {
  success: boolean;
  message: string;
};

export const loginAction = async (
  _state: LoginActionState,
  formData: FormData,
): Promise<LoginActionState> => {
  const email = formData.get("email")?.toString().trim() || "";
  const password = formData.get("password")?.toString().trim() || "";

  try {
    const res = await api.post("/auth/login", { email, password });

    const result = res.data;

    if (result.success) {
      const cookieStore = await cookies();

      cookieStore.set("accessToken", result.data.accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 1, // 1 day
      });
      cookieStore.set("refreshToken", result.data.refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });
    }

    return {
      success: true,
      message: res.data?.message || "Login successful",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Login failed. Please try again.",
    };
  }
};
