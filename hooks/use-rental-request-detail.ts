"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import type { RentalRequest } from "@/types/rental";

export const fetchRentalRequestDetail = async (
  id: string,
): Promise<RentalRequest> => {
  const { data } = await api.get(`/rentals/${id}`);
  if (!data.success) {
    throw new Error(data.message || "Failed to fetch rental request details");
  }
  return data.data;
};

export const useRentalRequestDetail = (id: string) => {
  return useQuery<RentalRequest, Error>({
    queryKey: ["rental-request", id],
    queryFn: () => fetchRentalRequestDetail(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    retry: 2,
    refetchOnWindowFocus: false,
  });
};
