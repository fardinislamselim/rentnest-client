import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { adminApi } from "@/lib/admin-api";
import type { AdminRental, AdminRentalQuery } from "@/types/admin";
import type { PaginationMeta } from "@/types/api";

export interface AdminRentalsPage {
  rentals: AdminRental[];
  meta: PaginationMeta;
}

const fetchRentals = async (
  query: AdminRentalQuery,
): Promise<AdminRentalsPage> => {
  const { data, meta } = await adminApi.get<AdminRental[]>("/rentals", {
    page: query.page,
    limit: query.limit,
    status: query.status,
    search: query.search,
    sortBy: query.sortBy,
    sortOrder: query.sortOrder,
  });

  return {
    rentals: data,
    meta: meta ?? {
      page: query.page ?? 1,
      limit: query.limit ?? data.length,
      total: data.length,
    },
  };
};

/**
 * `GET /admin/rentals` — every rental request on the platform. Search matches
 * tenant name/email and property title/location server-side; landlord is not
 * searchable because the endpoint does not join it.
 */
export const useAdminRentals = (query: AdminRentalQuery) =>
  useQuery<AdminRentalsPage, Error>({
    queryKey: ["admin-rentals", query],
    queryFn: () => fetchRentals(query),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 10,
    retry: 2,
    refetchOnWindowFocus: false,
  });
