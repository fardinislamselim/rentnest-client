import { useQueries, useQuery } from "@tanstack/react-query";

import { adminApi } from "@/lib/admin-api";
import type { AdminDashboardStats, AdminRental, AdminRentalCounts } from "@/types/admin";
import type { RentalStatus } from "@/types/rental";

export const RENTAL_STATUSES: RentalStatus[] = [
  "PENDING",
  "APPROVED",
  "ACTIVE",
  "COMPLETED",
  "REJECTED",
];

const ZERO_COUNTS: AdminRentalCounts = {
  PENDING: 0,
  APPROVED: 0,
  ACTIVE: 0,
  COMPLETED: 0,
  REJECTED: 0,
};

const fetchDashboard = async (): Promise<AdminDashboardStats> => {
  const { data } = await adminApi.get<AdminDashboardStats>("/dashboard");
  return data;
};

export const useAdminDashboard = () =>
  useQuery<AdminDashboardStats, Error>({
    queryKey: ["admin-dashboard"],
    queryFn: fetchDashboard,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    retry: 2,
    refetchOnWindowFocus: false,
  });

/**
 * Per-status rental totals.
 *
 * `GET /admin/dashboard` returns neither a pending-request nor an active-rental
 * count, so each status is read from the `meta.total` of a one-row query against
 * `GET /admin/rentals?status=…&limit=1`. The count is the backend's own
 * `prisma.count` for that filter — exact, and it transfers a single row.
 */
export const useAdminRentalCounts = () => {
  const results = useQueries({
    queries: RENTAL_STATUSES.map((status) => ({
      queryKey: ["admin-rental-count", status],
      queryFn: async () => {
        const { meta } = await adminApi.get<AdminRental[]>("/rentals", {
          status,
          limit: 1,
          page: 1,
        });
        return meta?.total ?? 0;
      },
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 10,
      retry: 2,
      refetchOnWindowFocus: false,
    })),
  });

  const isLoading = results.some((result) => result.isLoading);
  const isError = results.some((result) => result.isError);

  const counts = RENTAL_STATUSES.reduce<AdminRentalCounts>(
    (acc, status, index) => {
      acc[status] = results[index]?.data ?? 0;
      return acc;
    },
    { ...ZERO_COUNTS },
  );

  return { counts, isLoading, isError };
};
