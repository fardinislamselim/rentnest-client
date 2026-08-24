"use client";

import { useEffect, useMemo, useState } from "react";
import { ClipboardList, MapPin, Search, X } from "lucide-react";

import { AdminPagination } from "@/components/admin/admin-pagination";
import { RentalStatusBadge } from "@/components/admin/admin-status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import TableSkeleton from "@/components/ui/table-skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAdminPropertyIndex } from "@/hooks/use-admin-property-index";
import { useAdminRentals } from "@/hooks/use-admin-rentals";
import { useAdminUsers } from "@/hooks/use-admin-users";
import { formatCurrency, formatDate, initialsOf } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { AdminRentalQuery } from "@/types/admin";
import type { RentalStatus } from "@/types/rental";

const PAGE_SIZE = 10;

const STATUS_OPTIONS: { value: RentalStatus | "ALL"; label: string }[] = [
  { value: "ALL", label: "All statuses" },
  { value: "PENDING", label: "Pending" },
  { value: "APPROVED", label: "Approved" },
  { value: "ACTIVE", label: "Active" },
  { value: "COMPLETED", label: "Completed" },
  { value: "REJECTED", label: "Rejected" },
];

const SORT_OPTIONS: {
  value: string;
  label: string;
  sortBy: NonNullable<AdminRentalQuery["sortBy"]>;
  sortOrder: NonNullable<AdminRentalQuery["sortOrder"]>;
}[] = [
  { value: "newest", label: "Newest first", sortBy: "createdAt", sortOrder: "desc" },
  { value: "oldest", label: "Oldest first", sortBy: "createdAt", sortOrder: "asc" },
  { value: "start", label: "Start date", sortBy: "startDate", sortOrder: "desc" },
  { value: "status", label: "Status", sortBy: "status", sortOrder: "asc" },
];

export function AdminRentalsTable({
  initialStatus = "ALL",
}: {
  initialStatus?: RentalStatus | "ALL";
}) {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState<RentalStatus | "ALL">(initialStatus);
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);

  // Debounce the search box, and reset to the first page whenever the matched
  // set changes — the old offset is meaningless against a different result set.
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 350);
    return () => clearTimeout(timer);
  }, [search]);

  const sortConfig = SORT_OPTIONS.find((option) => option.value === sort) ?? SORT_OPTIONS[0];

  const query: AdminRentalQuery = useMemo(
    () => ({
      page,
      limit: PAGE_SIZE,
      search: debouncedSearch || undefined,
      status: status === "ALL" ? undefined : status,
      sortBy: sortConfig.sortBy,
      sortOrder: sortConfig.sortOrder,
    }),
    [page, debouncedSearch, status, sortConfig],
  );

  const { data, isLoading, isFetching, error } = useAdminRentals(query);

  // The rentals endpoint nests only `{ id, title, location }` for the property and
  // carries no landlord, so Rent and Landlord are joined from these two lookups.
  const { data: propertyIndex } = useAdminPropertyIndex();
  const { data: users } = useAdminUsers();

  const ownerById = useMemo(() => {
    const map = new Map<string, { name: string; email: string }>();
    users?.forEach((user) => map.set(user.id, { name: user.name, email: user.email }));
    return map;
  }, [users]);

  const hasFilters = debouncedSearch !== "" || status !== "ALL";

  const changeStatus = (value: RentalStatus | "ALL") => {
    setStatus(value);
    setPage(1);
  };

  const changeSort = (value: string) => {
    setSort(value);
    setPage(1);
  };

  const clearFilters = () => {
    setSearch("");
    setStatus("ALL");
    setPage(1);
  };

  const rows = data?.rentals ?? [];
  const meta = data?.meta;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by tenant, email, property or location…"
            className="rounded-xl pl-9"
            aria-label="Search rental requests"
          />
        </div>

        <Select
          value={status}
          onValueChange={(value) => changeStatus(value as RentalStatus | "ALL")}
        >
          <SelectTrigger className="rounded-xl lg:w-[160px]" aria-label="Filter by status">
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

        <Select value={sort} onValueChange={changeSort}>
          <SelectTrigger className="rounded-xl lg:w-[150px]" aria-label="Sort requests">
            <SelectValue placeholder="Sort" />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((option) => (
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

      {isLoading ? (
        <TableSkeleton columns={6} rows={5} avatar badge />
      ) : (
      <div className="overflow-hidden rounded-2xl border border-border/60 bg-card">
        <div className={cn("overflow-x-auto", isFetching && !isLoading && "opacity-70")}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tenant</TableHead>
                <TableHead>Property</TableHead>
                <TableHead>Landlord</TableHead>
                <TableHead>Rent</TableHead>
                <TableHead>Request date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {error ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-16 text-center">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10">
                      <ClipboardList className="h-7 w-7 text-red-500" aria-hidden="true" />
                    </div>
                    <p className="font-heading text-lg font-semibold text-foreground">
                      Failed to load rental requests
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">{error.message}</p>
                  </TableCell>
                </TableRow>
              ) : rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-16 text-center">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
                      <ClipboardList
                        className="h-7 w-7 text-muted-foreground"
                        aria-hidden="true"
                      />
                    </div>
                    <p className="font-heading text-lg font-semibold text-foreground">
                      {hasFilters
                        ? "No requests match these filters"
                        : "No rental requests yet"}
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
                rows.map((rental) => {
                  const property = propertyIndex?.get(rental.propertyId);
                  const landlord = property
                    ? ownerById.get(property.landlordId)
                    : undefined;

                  return (
                    <TableRow key={rental.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sky-500/10 text-xs font-bold text-sky-600 dark:text-sky-400">
                            {initialsOf(rental.tenant.name)}
                          </span>
                          <div className="min-w-0">
                            <p className="truncate font-medium text-foreground">
                              {rental.tenant.name}
                            </p>
                            <p className="truncate text-xs text-muted-foreground">
                              {rental.tenant.email}
                            </p>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="min-w-0">
                          <p className="truncate font-medium text-foreground">
                            {rental.property.title}
                          </p>
                          <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-muted-foreground">
                            <MapPin className="h-3 w-3 shrink-0" aria-hidden="true" />
                            {rental.property.location}
                          </p>
                        </div>
                      </TableCell>

                      <TableCell>
                        {landlord ? (
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-foreground">
                              {landlord.name}
                            </p>
                            <p className="truncate text-xs text-muted-foreground">
                              {landlord.email}
                            </p>
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">—</span>
                        )}
                      </TableCell>

                      <TableCell className="whitespace-nowrap text-sm">
                        {property ? (
                          <>
                            <span className="text-foreground">
                              {formatCurrency(property.price)}
                            </span>
                            <span className="text-muted-foreground">/mo</span>
                          </>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>

                      <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                        {formatDate(rental.createdAt)}
                      </TableCell>

                      <TableCell>
                        <RentalStatusBadge status={rental.status} />
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        {!error && meta ? (
          <AdminPagination
            page={meta.page}
            limit={meta.limit}
            total={meta.total}
            onPageChange={setPage}
            label="requests"
          />
        ) : null}
      </div>)}

      <p className="text-xs text-muted-foreground">
        Read-only. Approving or rejecting a request is the property owner&apos;s
        decision — the backend exposes that action to the LANDLORD role only.
      </p>
    </div>
  );
}
