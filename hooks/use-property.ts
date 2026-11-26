import { useQuery } from "@tanstack/react-query";
import { api, unwrapApiResponse } from "@/lib/axios";
import type { IApiResponse } from "@/types/api";
import type { IProperty } from "@/types/property";

const fetchProperty = async (propertyId: string): Promise<IProperty> => {
  return unwrapApiResponse(
    api.get<IApiResponse<IProperty>>(`/properties/${propertyId}`),
    "Failed to fetch property",
  );
};

export const useProperty = (
  propertyId: string,
  initialData?: IProperty,
) => {
  return useQuery<IProperty, Error>({
    queryKey: ["property", propertyId],
    queryFn: () => fetchProperty(propertyId),
    initialData,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    retry: 2,
    refetchOnWindowFocus: false,
    enabled: !!propertyId,
  });
};
