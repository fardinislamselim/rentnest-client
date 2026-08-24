import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { adminApi } from "@/lib/admin-api";
import type { AdminUser } from "@/types/admin";
import type { UserRole, UserStatus } from "@/types/user";

export const ADMIN_USERS_QUERY_KEY = ["admin-users"] as const;

const fetchUsers = async (): Promise<AdminUser[]> => {
  const { data } = await adminApi.get<AdminUser[]>("/users");
  return data;
};

/**
 * `GET /admin/users` accepts no query parameters and returns the full user list
 * in one response, so search, role/status filtering and pagination are all
 * derived on the client from that single cached fetch.
 */
export const useAdminUsers = () =>
  useQuery<AdminUser[], Error>({
    queryKey: ADMIN_USERS_QUERY_KEY,
    queryFn: fetchUsers,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    retry: 2,
    refetchOnWindowFocus: false,
  });

export interface AdminUserFilters {
  search: string;
  role: UserRole | "ALL";
  status: UserStatus | "ALL";
  page: number;
  limit: number;
}

export interface AdminUsersView {
  rows: AdminUser[];
  total: number;
  totalPages: number;
  /** Role tallies over the filtered set, before pagination. */
  matchedByRole: Record<UserRole, number>;
}

const byNewest = (a: AdminUser, b: AdminUser) =>
  new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();

export const selectAdminUsers = (
  users: AdminUser[] | undefined,
  { search, role, status, page, limit }: AdminUserFilters,
): AdminUsersView => {
  const term = search.trim().toLowerCase();

  const matched = (users ?? [])
    .filter((user) => {
      if (role !== "ALL" && user.role !== role) return false;
      if (status !== "ALL" && user.status !== status) return false;
      if (!term) return true;
      return (
        user.name.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term)
      );
    })
    .sort(byNewest);

  const matchedByRole = matched.reduce<Record<UserRole, number>>(
    (acc, user) => {
      acc[user.role] += 1;
      return acc;
    },
    { ADMIN: 0, LANDLORD: 0, TENANT: 0 },
  );

  const totalPages = Math.max(1, Math.ceil(matched.length / limit));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * limit;

  return {
    rows: matched.slice(start, start + limit),
    total: matched.length,
    totalPages,
    matchedByRole,
  };
};

export const useAdminUsersView = (filters: AdminUserFilters) => {
  const query = useAdminUsers();

  const view = useMemo(
    () => selectAdminUsers(query.data, filters),
    [query.data, filters],
  );

  return { ...query, view };
};

/** `PATCH /admin/users/:id/status` — the ban / unban action. */
export const useUpdateUserStatus = () => {
  const [pendingId, setPendingId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const updateStatus = async (
    userId: string,
    status: UserStatus,
  ): Promise<boolean> => {
    setPendingId(userId);

    const previous = queryClient.getQueryData<AdminUser[]>(ADMIN_USERS_QUERY_KEY);

    queryClient.setQueryData<AdminUser[]>(ADMIN_USERS_QUERY_KEY, (old) =>
      old?.map((user) => (user.id === userId ? { ...user, status } : user)),
    );

    try {
      await adminApi.patch(`/users/${userId}/status`, { status });
      toast.success(status === "BANNED" ? "User banned" : "User unbanned");
      queryClient.invalidateQueries({ queryKey: ADMIN_USERS_QUERY_KEY });
      return true;
    } catch (error) {
      queryClient.setQueryData(ADMIN_USERS_QUERY_KEY, previous);
      toast.error(
        error instanceof Error ? error.message : "Failed to update user status",
      );
      return false;
    } finally {
      setPendingId(null);
    }
  };

  return { updateStatus, pendingId, isUpdating: pendingId !== null };
};

/** `DELETE /admin/users/:id` — permanent removal. */
export const useDeleteUser = () => {
  const [pendingId, setPendingId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const deleteUser = async (userId: string): Promise<boolean> => {
    setPendingId(userId);

    try {
      await adminApi.delete(`/users/${userId}`);
      toast.success("User deleted");
      queryClient.invalidateQueries({ queryKey: ADMIN_USERS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["admin-dashboard"] });
      return true;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete user");
      return false;
    } finally {
      setPendingId(null);
    }
  };

  return { deleteUser, pendingId, isDeleting: pendingId !== null };
};
