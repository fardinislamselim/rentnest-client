"use server";

import { api } from "@/lib/axios";
import axios from "axios";
import type { User } from "@/types/user";

export const getMe = async (): Promise<User | null> => {
  try {
    const res = await api.get("/auth/me");
    return res.data?.data ?? res.data ?? null;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        return null;
      }
    }
    return null;
  }
};
