import { useState } from "react";
import { keepPreviousData, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { adminApi } from "@/lib/admin-api";
import type { AdminProperty, AdminPropertyQuery } from "@/types/admin";
import type { PaginationMeta } from "@/types/api";

export interface AdminPropertiesPage {
  properties: AdminProperty[];
  meta: PaginationMeta;
}

const fetchProperties = async (
  query: AdminPropertyQuery,
): Promise<AdminPropertiesPage> => {
  const { data, meta } = await adminApi.get<AdminProperty[]>("/properties", {
    page: query.page,
    limit: query.limit,
    status: query.status,
    location: query.location,
    categoryId: query.categoryId,
    search: query.search,
    sortBy: query.sortBy,
    sortOrder: query.sortOrder,
  });

  return {
    properties: data,
    meta: meta ?? {
      page: query.page ?? 1,
      limit: query.limit ?? data.length,
      total: data.length,
    },
  };
};

/**
 * `GET /admin/properties` paginates, searches, filters and sorts server-side —
 * see `adminPropertyQuerySchema` — so the query object is passed through as-is.
 */
export const useAdminProperties = (query: AdminPropertyQuery) =>
  useQuery<AdminPropertiesPage, Error>({
    queryKey: ["admin-properties", query],
    queryFn: () => fetchProperties(query),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 10,
    retry: 2,
    refetchOnWindowFocus: false,
  });

/**
 * `DELETE /admin/properties/:id` — the only moderation action the backend gives
 * an admin. There is no approve/reject flow, and `PATCH /properties/:id/status`
 * is guarded by `auth(Role.LANDLORD)`, so availability is read-only here.
 */
export const useDeleteAdminProperty = () => {
  const [pendingId, setPendingId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const deleteProperty = async (propertyId: string): Promise<boolean> => {
    setPendingId(propertyId);

    try {
      await adminApi.delete(`/properties/${propertyId}`);
      toast.success("Property removed");
      queryClient.invalidateQueries({ queryKey: ["admin-properties"] });
      queryClient.invalidateQueries({ queryKey: ["admin-property-index"] });
      queryClient.invalidateQueries({ queryKey: ["admin-dashboard"] });
      return true;
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to remove property",
      );
      return false;
    } finally {
      setPendingId(null);
    }
  };

  return { deleteProperty, pendingId, isDeleting: pendingId !== null };
};
