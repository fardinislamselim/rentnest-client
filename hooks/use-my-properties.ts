import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { ApiResponse } from "@/types/api";
import { Property } from "@/types/property";

const fetchMyProperties = async (): Promise<Property[]> => {
  const { data } = await api.get<ApiResponse<Property[]>>("/properties/my-properties");
  if (!data.success) {
    throw new Error(data.message || "Failed to fetch properties");
  }
  return data.data;
};

export const useMyProperties = () => {
  return useQuery<Property[], Error>({
    queryKey: ["my-properties"],
    queryFn: fetchMyProperties,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    retry: 2,
    refetchOnWindowFocus: false,
  });
};
