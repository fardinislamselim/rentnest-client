import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { ApiResponse } from "@/types/api";

export interface Category {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

const fetchCategories = async (): Promise<Category[]> => {
  const { data } = await api.get<ApiResponse<Category[]>>("/categories");

  if (!data.success) {
    throw new Error(data.message || "Failed to fetch categories");
  }

  console.log(data.data, "category Data");
  return data.data;
};

export const useCategories = () => {
  return useQuery<Category[], Error>({
    queryKey: ["categories"],
    queryFn: fetchCategories,

    // Cache for 5 minutes
    staleTime: 1000 * 60 * 5,

    // Keep in cache for 10 minutes after unused
    gcTime: 1000 * 60 * 10,

    retry: 2,

    refetchOnWindowFocus: false,
  });
};
