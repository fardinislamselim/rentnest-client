"use server";

import { api } from "@/lib/axios";
import axios from "axios";
import { cookies } from "next/headers";
import jwt, { JwtPayload } from "jsonwebtoken";
import type { AuthActionState } from "@/types/auth";

type LoginActionState = AuthActionState;

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

    const decoded = jwt.decode(result.data.accessToken) as JwtPayload | null;
    const redirectTo =
      decoded?.role === "LANDLORD"
        ? "/landlord-dashboard"
        : decoded?.role === "ADMIN"
        ? "/admin-dashboard"
        : "/dashboard";

    return {
      success: true,
      message: res.data?.message || "Login successful",
      redirectTo,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const serverMessage =
        typeof error.response?.data === "object" &&
        error.response?.data !== null &&
        "message" in error.response.data
          ? (error.response.data as { message?: string }).message
          : undefined;

      return {
        success: false,
        message:
          serverMessage ||
          error.response?.statusText ||
          error.message ||
          "Login failed. Please try again.",
      };
    }

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Login failed. Please try again.",
    };
  }
};

export const registerAction = async (
  _state: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> => {
  const name = formData.get("name")?.toString().trim() || "";
  const email = formData.get("email")?.toString().trim() || "";
  const password = formData.get("password")?.toString().trim() || "";
  const confirmPassword =
    formData.get("confirmPassword")?.toString().trim() || "";
  const phone = formData.get("phone")?.toString().trim() || "";
  const role = (formData.get("role")?.toString() || "TENANT") as
    | "TENANT"
    | "LANDLORD";

  if (!name || name.length < 2) {
    return {
      success: false,
      message: "Name must be at least 2 characters.",
    };
  }

  if (!email || !email.includes("@")) {
    return {
      success: false,
      message: "Please enter a valid email address.",
    };
  }

  if (!password || password.length < 6) {
    return {
      success: false,
      message: "Password must be at least 6 characters.",
    };
  }

  if (password !== confirmPassword) {
    return {
      success: false,
      message: "Passwords do not match.",
    };
  }

  try {
    const registerPayload: Record<string, string | undefined> = {
      name,
      email,
      password,
      role,
    };
    if (phone) registerPayload.phone = phone;

    const res = await api.post("/auth/register", registerPayload);

    if (res.data?.success) {
      // Auto-login registered user
      try {
        const loginRes = await api.post("/auth/login", { email, password });
        if (loginRes.data?.success) {
          const cookieStore = await cookies();
          cookieStore.set("accessToken", loginRes.data.data.accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 1,
          });
          cookieStore.set("refreshToken", loginRes.data.data.refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 7,
          });

          const redirectTo =
            role === "LANDLORD" ? "/landlord-dashboard" : "/dashboard";

          return {
            success: true,
            message: "Account created and logged in successfully!",
            redirectTo,
          };
        }
      } catch {
        // Fallback if login endpoint fails after registration
        return {
          success: true,
          message: "Registration successful! Please log in.",
          redirectTo: "/login",
        };
      }
    }

    return {
      success: true,
      message: res.data?.message || "Registration successful!",
      redirectTo: "/login",
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const serverMessage =
        typeof error.response?.data === "object" &&
        error.response?.data !== null &&
        "message" in error.response.data
          ? (error.response.data as { message?: string }).message
          : undefined;

      return {
        success: false,
        message:
          serverMessage ||
          error.response?.statusText ||
          error.message ||
          "Registration failed. Please try again.",
      };
    }

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Registration failed. Please try again.",
    };
  }
};
