"use client";

import { useEffect, useMemo, useState } from "react";
import { Ban, Loader2, Search, ShieldCheck, Trash2, Users, X } from "lucide-react";

import { AdminPagination } from "@/components/admin/admin-pagination";
import { UserRoleBadge, UserStatusBadge } from "@/components/admin/admin-status-badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useAdminUsersView,
  useDeleteUser,
  useUpdateUserStatus,
  type AdminUserFilters,
} from "@/hooks/use-admin-users";
import { formatDate, formatNumber, initialsOf } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { AdminUser } from "@/types/admin";
import type { UserRole, UserStatus } from "@/types/user";

const PAGE_SIZE = 10;

const ROLE_OPTIONS: { value: UserRole | "ALL"; label: string }[] = [
  { value: "ALL", label: "All roles" },
  { value: "TENANT", label: "Tenant" },
  { value: "LANDLORD", label: "Landlord" },
  { value: "ADMIN", label: "Admin" },
];

const STATUS_OPTIONS: { value: UserStatus | "ALL"; label: string }[] = [
  { value: "ALL", label: "All statuses" },
  { value: "ACTIVE", label: "Active" },
  { value: "BANNED", label: "Banned" },
];

type PendingAction =
  | { kind: "ban"; user: AdminUser }
  | { kind: "unban"; user: AdminUser }
  | { kind: "delete"; user: AdminUser }
  | null;

function RowSkeleton() {
  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-3">
          <Skeleton className="h-9 w-9 rounded-full" />
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-28 rounded" />
            <Skeleton className="h-3 w-40 rounded" />
          </div>
        </div>
      </TableCell>
      <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
      <TableCell><Skeleton className="h-6 w-16 rounded-full" /></TableCell>
      <TableCell><Skeleton className="h-4 w-24 rounded" /></TableCell>
      <TableCell className="text-right"><Skeleton className="ml-auto h-8 w-24 rounded-xl" /></TableCell>
    </TableRow>
  );
}

export function AdminUsersTable({ currentUserId }: { currentUserId?: string }) {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [role, setRole] = useState<UserRole | "ALL">("ALL");
  const [status, setStatus] = useState<UserStatus | "ALL">("ALL");
  const [page, setPage] = useState(1);
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);

  // Debounce the search box, and reset to the first page whenever the matched
  // set changes — the old offset is meaningless against a different result set.
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const filters: AdminUserFilters = useMemo(
    () => ({ search: debouncedSearch, role, status, page, limit: PAGE_SIZE }),
    [debouncedSearch, role, status, page],
  );

  const { view, isLoading, error } = useAdminUsersView(filters);
  const { updateStatus, pendingId: statusPendingId } = useUpdateUserStatus();
  const { deleteUser, pendingId: deletePendingId } = useDeleteUser();

  const hasFilters = debouncedSearch !== "" || role !== "ALL" || status !== "ALL";

  const changeRole = (value: UserRole | "ALL") => {
    setRole(value);
    setPage(1);
  };

  const changeStatus = (value: UserStatus | "ALL") => {
    setStatus(value);
    setPage(1);
  };

  const clearFilters = () => {
    setSearch("");
    setRole("ALL");
    setStatus("ALL");
    setPage(1);
  };

  const confirmAction = async () => {
    if (!pendingAction) return;

    const { kind, user } = pendingAction;
    setPendingAction(null);

    if (kind === "delete") {
      await deleteUser(user.id);
      return;
    }

    await updateStatus(user.id, kind === "ban" ? "BANNED" : "ACTIVE");
  };

  return (
    <div className="space-y-4">
      {/* Filters sit in one row above the table. */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by name or email…"
            className="rounded-xl pl-9"
            aria-label="Search users"
          />
        </div>

        <Select value={role} onValueChange={(value) => changeRole(value as UserRole | "ALL")}>
          <SelectTrigger className="rounded-xl sm:w-[150px]" aria-label="Filter by role">
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent>
            {ROLE_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={status}
          onValueChange={(value) => changeStatus(value as UserStatus | "ALL")}
        >
          <SelectTrigger className="rounded-xl sm:w-[160px]" aria-label="Filter by status">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {hasFilters ? (
          <Button
            variant="ghost"
            size="sm"
            className="rounded-xl text-muted-foreground"
            onClick={clearFilters}
          >
            <X className="h-3.5 w-3.5" aria-hidden="true" />
            Clear
          </Button>
        ) : null}
      </div>

      {hasFilters && !isLoading ? (
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground tabular-nums">
            {formatNumber(view.total)}
          </span>{" "}
          {view.total === 1 ? "user matches" : "users match"} · {view.matchedByRole.TENANT}{" "}
          tenant{view.matchedByRole.TENANT === 1 ? "" : "s"}, {view.matchedByRole.LANDLORD}{" "}
          landlord{view.matchedByRole.LANDLORD === 1 ? "" : "s"}, {view.matchedByRole.ADMIN}{" "}
          admin{view.matchedByRole.ADMIN === 1 ? "" : "s"}
        </p>
      ) : null}

      <div className="overflow-hidden rounded-2xl border border-border/60 bg-card">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, index) => <RowSkeleton key={index} />)
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-16 text-center">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10">
                      <Users className="h-7 w-7 text-red-500" aria-hidden="true" />
                    </div>
                    <p className="font-heading text-lg font-semibold text-foreground">
                      Failed to load users
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">{error.message}</p>
                  </TableCell>
                </TableRow>
              ) : view.rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-16 text-center">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
                      <Users className="h-7 w-7 text-muted-foreground" aria-hidden="true" />
                    </div>
                    <p className="font-heading text-lg font-semibold text-foreground">
                      {hasFilters ? "No users match these filters" : "No users yet"}
                    </p>
                    {hasFilters ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="mt-3 rounded-xl"
                        onClick={clearFilters}
                      >
                        Clear filters
                      </Button>
                    ) : null}
                  </TableCell>
                </TableRow>
              ) : (
                view.rows.map((user) => {
                  const isSelf = user.id === currentUserId;
                  const isAdmin = user.role === "ADMIN";
                  const isBusy =
                    statusPendingId === user.id || deletePendingId === user.id;
                  // Admin accounts are not moderated from this table, and no one
                  // can act on their own account.
                  const locked = isAdmin || isSelf;

                  return (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                            {initialsOf(user.name)}
                          </span>
                          <div className="min-w-0">
                            <p className="truncate font-medium text-foreground">
                              {user.name}
                              {isSelf ? (
                                <span className="ml-2 text-xs font-normal text-muted-foreground">
                                  (you)
                                </span>
                              ) : null}
                            </p>
                            <p className="truncate text-xs text-muted-foreground">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <UserRoleBadge role={user.role} />
                      </TableCell>

                      <TableCell>
                        <UserStatusBadge status={user.status} />
                      </TableCell>

                      <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                        {formatDate(user.createdAt)}
                      </TableCell>

                      <TableCell className="text-right">
                        {locked ? (
                          <span
                            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground"
                            title={
                              isSelf
                                ? "You cannot moderate your own account"
                                : "Admin accounts are not moderated here"
                            }
                          >
                            <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
                            —
                          </span>
                        ) : (
                          <div className="flex justify-end gap-2">
                            {user.status === "ACTIVE" ? (
                              <Button
                                variant="outline"
                                size="sm"
                                className="rounded-xl border-red-500/40 text-red-600 hover:bg-red-500/10 dark:text-red-400"
                                onClick={() => setPendingAction({ kind: "ban", user })}
                                disabled={isBusy}
                              >
                                {isBusy ? (
                                  <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                                ) : (
                                  <Ban className="h-3.5 w-3.5" aria-hidden="true" />
                                )}
                                Ban
                              </Button>
                            ) : (
                              <Button
                                variant="outline"
                                size="sm"
                                className="rounded-xl border-emerald-500/40 text-emerald-600 hover:bg-emerald-500/10 dark:text-emerald-400"
                                onClick={() => setPendingAction({ kind: "unban", user })}
                                disabled={isBusy}
                              >
                                {isBusy ? (
                                  <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                                ) : (
                                  <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
                                )}
                                Unban
                              </Button>
                            )}

                            <Button
                              variant="ghost"
                              size="icon-sm"
                              className="rounded-xl text-muted-foreground hover:text-red-600"
                              onClick={() => setPendingAction({ kind: "delete", user })}
                              disabled={isBusy}
                              aria-label={`Delete ${user.name}`}
                              title="Delete user"
                            >
                              <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        {!isLoading && !error ? (
          <AdminPagination
            page={Math.min(page, view.totalPages)}
            limit={PAGE_SIZE}
            total={view.total}
            onPageChange={setPage}
            label="users"
          />
        ) : null}
      </div>

      <AlertDialog
        open={pendingAction !== null}
        onOpenChange={(open) => !open && setPendingAction(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {pendingAction?.kind === "delete"
                ? `Delete ${pendingAction.user.name}?`
                : pendingAction?.kind === "ban"
                  ? `Ban ${pendingAction.user.name}?`
                  : `Unban ${pendingAction?.user.name}?`}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {pendingAction?.kind === "delete"
                ? "This permanently removes the account and cannot be undone."
                : pendingAction?.kind === "ban"
                  ? "The account will be blocked from signing in until it is unbanned."
                  : "The account will be able to sign in again."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction
              className={cn(
                "rounded-xl",
                pendingAction?.kind !== "unban" &&
                  "bg-red-600 hover:bg-red-700 focus-visible:outline-red-600",
              )}
              onClick={confirmAction}
            >
              {pendingAction?.kind === "delete"
                ? "Delete"
                : pendingAction?.kind === "ban"
                  ? "Ban user"
                  : "Unban user"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
