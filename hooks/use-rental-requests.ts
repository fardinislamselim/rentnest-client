import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { ApiResponse } from "@/types/api";
import type { RentalRequest } from "@/types/rental";

const fetchRentalRequests = async (): Promise<RentalRequest[]> => {
  const { data } = await api.get<ApiResponse<RentalRequest[]>>("/rentals/requests");
  if (!data.success) {
    throw new Error(data.message || "Failed to fetch rental requests");
  }
  return data.data;
};

export const useRentalRequests = () => {
  return useQuery<RentalRequest[], Error>({
    queryKey: ["rental-requests"],
    queryFn: fetchRentalRequests,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    retry: 2,
    refetchOnWindowFocus: false,
  });
};
