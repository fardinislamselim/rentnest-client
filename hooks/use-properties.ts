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
  
  const categoryFilter = params?.category || params?.type;
  if (categoryFilter) {
    query.append("category", categoryFilter);
  }

  if (params?.budget) {
    query.append("budget", params.budget);
    if (params.budget === "0-15000") {
      query.append("minPrice", "0");
      query.append("maxPrice", "15000");
    } else if (params.budget === "15000-30000") {
      query.append("minPrice", "15000");
      query.append("maxPrice", "30000");
    } else if (params.budget === "30000-50000") {
      query.append("minPrice", "30000");
      query.append("maxPrice", "50000");
    } else if (params.budget === "50000+") {
      query.append("minPrice", "50000");
    }
  }

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
  let propertiesList: Property[] = [];

  if (Array.isArray(result)) {
    propertiesList = result;
  } else if (result && typeof result === "object" && "properties" in result && Array.isArray(result.properties)) {
    propertiesList = result.properties;
  } else if (result && typeof result === "object" && "data" in result && Array.isArray(result.data)) {
    propertiesList = result.data;
  }

  // Client-side fallback filtering to ensure UI filters always respond smoothly
  if (categoryFilter) {
    propertiesList = propertiesList.filter((p) => {
      const catName = typeof p.category === "object" ? p.category.name : p.category;
      return catName?.toLowerCase().includes(categoryFilter.toLowerCase());
    });
  }

  if (params?.location) {
    propertiesList = propertiesList.filter(
      (p) =>
        p.location?.toLowerCase().includes(params.location!.toLowerCase()) ||
        p.city?.toLowerCase().includes(params.location!.toLowerCase()),
    );
  }

  return propertiesList;
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
