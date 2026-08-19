import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import type { RentalRequest } from "@/types/rental";

export const fetchMyRentals = async (): Promise<RentalRequest[]> => {
  const { data } = await api.get("/rentals/my-rentals");
  if (!data.success) {
    throw new Error(data.message || "Failed to fetch rentals");
  }
  return data.data ?? data ?? [];
};

export const useMyRentals = () => {
  return useQuery<RentalRequest[], Error>({
    queryKey: ["my-rentals"],
    queryFn: fetchMyRentals,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    retry: 2,
    refetchOnWindowFocus: false,
  });
};