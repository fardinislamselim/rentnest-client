import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { ApiResponse } from "@/types/api";
import { Property } from "@/types/property";

export interface PropertyQueryParams {
  location?: string;
  category?: string;
  type?: string;
  budget?: string;
  isFeatured?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}

export type PropertiesApiResponseData =
  | Property[]
  | {
      properties?: Property[];
      data?: Property[];
    };

export const fetchProperties = async (params?: PropertyQueryParams): Promise<Property[]> => {
  const query = new URLSearchParams();
  if (params?.location) query.append("location", params.location);
  if (params?.category) query.append("category", params.category);
  if (params?.type) query.append("type", params.type);
  if (params?.budget) query.append("budget", params.budget);
  if (params?.isFeatured !== undefined) query.append("isFeatured", String(params.isFeatured));
  if (params?.search) query.append("search", params.search);
  if (params?.page) query.append("page", String(params.page));
  if (params?.limit) query.append("limit", String(params.limit));

  const url = `/properties${query.toString() ? `?${query.toString()}` : ""}`;
  const { data } = await api.get<ApiResponse<PropertiesApiResponseData>>(url);

  if (!data.success) {
    throw new Error(data.message || "Failed to fetch properties");
  }

  // Handle both flat array and paginated response structure ({ data: [...] } or { data: { properties: [...] } })
  const result = data.data;
  if (Array.isArray(result)) {
    return result;
  }
  if (result && typeof result === "object" && "properties" in result && Array.isArray(result.properties)) {
    return result.properties;
  }
  if (result && typeof result === "object" && "data" in result && Array.isArray(result.data)) {
    return result.data;
  }

  return [];
};

export const useProperties = (params?: PropertyQueryParams) => {
  return useQuery<Property[], Error>({
    queryKey: ["properties", params],
    queryFn: () => fetchProperties(params),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    retry: 2,
    refetchOnWindowFocus: false,
  });
};
