"use client";

import { api } from "@/lib/axios";
import type { User } from "@/types/user";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useMe = () => {
  return useQuery<User | null>({
    queryKey: ["me"],
    queryFn: async () => {
      try {
        const res = await api.get("/auth/me");
        return res.data;
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          return null;
        }
        throw error;
      }
    },
    retry: false,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
};
