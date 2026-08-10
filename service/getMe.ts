"use server";

import { api } from "@/lib/axios";
import axios from "axios";

export const getMe = async () => {
  try {
    const res = await api.get("/auth/me");
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      return null;
    }
    throw error;
  }
};
