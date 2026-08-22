import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { ApiResponse } from "@/types/api";
import { Property } from "@/types/property";

const fetchProperty = async (propertyId: string): Promise<Property> => {
  const { data } = await api.get<ApiResponse<Property>>(
    `/properties/${propertyId}`
  );
  if (!data.success) {
    throw new Error(data.message || "Failed to fetch property");
  }
  return data.data;
};

export const useProperty = (propertyId: string) => {
  return useQuery<Property, Error>({
    queryKey: ["property", propertyId],
    queryFn: () => fetchProperty(propertyId),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    retry: 2,
    refetchOnWindowFocus: false,
    enabled: !!propertyId,
  });
};
