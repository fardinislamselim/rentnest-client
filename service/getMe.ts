"use server";

import { api } from "@/lib/axios";
import axios from "axios";

export const getMe = async () => {
  try {
    const res = await api.get("/auth/me");
    return res.data?.data ?? res.data ?? null;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      return null;
    }
    return null;
  }
};
