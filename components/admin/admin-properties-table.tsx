"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Building2,
  ExternalLink,
  Loader2,
  MapPin,
  Search,
  Trash2,
  X,
} from "lucide-react";

import { AdminPagination } from "@/components/admin/admin-pagination";
import { PropertyStatusBadge } from "@/components/admin/admin-status-badge";
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
import TableSkeleton from "@/components/ui/table-skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useAdminProperties,
  useDeleteAdminProperty,
} from "@/hooks/use-admin-properties";
import { useAdminUsers } from "@/hooks/use-admin-users";
import { useCategories } from "@/hooks/use-categories";
import { formatCurrency, formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { AdminProperty, AdminPropertyQuery, PropertyStatus } from "@/types/admin";

const PAGE_SIZE = 10;

const STATUS_OPTIONS: { value: PropertyStatus | "ALL"; label: string }[] = [
  { value: "ALL", label: "All statuses" },
  { value: "AVAILABLE", label: "Available" },
  { value: "RENTED", label: "Rented" },
  { value: "UNAVAILABLE", label: "Unavailable" },
];

const SORT_OPTIONS: {
  value: string;
  label: string;
  sortBy: NonNullable<AdminPropertyQuery["sortBy"]>;
  sortOrder: NonNullable<AdminPropertyQuery["sortOrder"]>;
}[] = [
  { value: "newest", label: "Newest first", sortBy: "createdAt", sortOrder: "desc" },
  { value: "oldest", label: "Oldest first", sortBy: "createdAt", sortOrder: "asc" },
  { value: "price-desc", label: "Highest rent", sortBy: "price", sortOrder: "desc" },
  { value: "price-asc", label: "Lowest rent", sortBy: "price", sortOrder: "asc" },
  { value: "title", label: "Title A–Z", sortBy: "title", sortOrder: "asc" },
];

export function AdminPropertiesTable() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState<PropertyStatus | "ALL">("ALL");
  const [categoryId, setCategoryId] = useState<string>("ALL");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [pendingDelete, setPendingDelete] = useState<AdminProperty | null>(null);

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

  const query: AdminPropertyQuery = useMemo(
    () => ({
      page,
      limit: PAGE_SIZE,
      search: debouncedSearch || undefined,
      status: status === "ALL" ? undefined : status,
      categoryId: categoryId === "ALL" ? undefined : categoryId,
      sortBy: sortConfig.sortBy,
      sortOrder: sortConfig.sortOrder,
    }),
    [page, debouncedSearch, status, categoryId, sortConfig],
  );

  const { data, isLoading, isFetching, error } = useAdminProperties(query);
  const { deleteProperty, pendingId } = useDeleteAdminProperty();

  // `GET /admin/properties` selects scalars only — it returns `landlordId` but no
  // landlord object — so owner names come from the admin user list.
  const { data: users } = useAdminUsers();
  const ownerById = useMemo(() => {
    const map = new Map<string, { name: string; email: string }>();
    users?.forEach((user) => map.set(user.id, { name: user.name, email: user.email }));
    return map;
  }, [users]);

  const { data: categories } = useCategories();
  const categoryById = useMemo(() => {
    const map = new Map<string, string>();
    categories?.forEach((category) => map.set(category.id, category.name));
    return map;
  }, [categories]);

  const hasFilters =
    debouncedSearch !== "" || status !== "ALL" || categoryId !== "ALL";

  const changeStatus = (value: PropertyStatus | "ALL") => {
    setStatus(value);
    setPage(1);
  };

  const changeCategory = (value: string) => {
    setCategoryId(value);
    setPage(1);
  };

  const changeSort = (value: string) => {
    setSort(value);
    setPage(1);
  };

  const clearFilters = () => {
    setSearch("");
    setStatus("ALL");
    setCategoryId("ALL");
    setPage(1);
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    const target = pendingDelete;
    setPendingDelete(null);
    await deleteProperty(target.id);
  };

  const rows = data?.properties ?? [];
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
            placeholder="Search by title, location or description…"
            className="rounded-xl pl-9"
            aria-label="Search properties"
          />
        </div>

        <Select
          value={status}
          onValueChange={(value) => changeStatus(value as PropertyStatus | "ALL")}
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

        <Select value={categoryId} onValueChange={changeCategory}>
          <SelectTrigger className="rounded-xl lg:w-[170px]" aria-label="Filter by category">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All categories</SelectItem>
            {categories?.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={sort} onValueChange={changeSort}>
          <SelectTrigger className="rounded-xl lg:w-[160px]" aria-label="Sort properties">
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
        <TableSkeleton columns={6} rows={5} avatar badge action />
      ) : (
      <div className="overflow-hidden rounded-2xl border border-border/60 bg-card">
        <div className={cn("overflow-x-auto", isFetching && !isLoading && "opacity-70")}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Property</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Rent</TableHead>
                <TableHead>Availability</TableHead>
                <TableHead>Listed</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {error ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-16 text-center">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10">
                      <Building2 className="h-7 w-7 text-red-500" aria-hidden="true" />
                    </div>
                    <p className="font-heading text-lg font-semibold text-foreground">
                      Failed to load properties
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">{error.message}</p>
                  </TableCell>
                </TableRow>
              ) : rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-16 text-center">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
                      <Building2 className="h-7 w-7 text-muted-foreground" aria-hidden="true" />
                    </div>
                    <p className="font-heading text-lg font-semibold text-foreground">
                      {hasFilters ? "No properties match these filters" : "No properties listed yet"}
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
                rows.map((property) => {
                  const owner = ownerById.get(property.landlordId);
                  const category = categoryById.get(property.categoryId);
                  const isBusy = pendingId === property.id;

                  return (
                    <TableRow key={property.id}>
                      <TableCell>
                        <div className="min-w-0">
                          <p className="truncate font-medium text-foreground">
                            {property.title}
                          </p>
                          <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-muted-foreground">
                            <MapPin className="h-3 w-3 shrink-0" aria-hidden="true" />
                            {property.location}
                            {category ? (
                              <span className="ml-1 shrink-0 rounded bg-muted px-1.5 py-0.5">
                                {category}
                              </span>
                            ) : null}
                          </p>
                        </div>
                      </TableCell>

                      <TableCell>
                        {owner ? (
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-foreground">
                              {owner.name}
                            </p>
                            <p className="truncate text-xs text-muted-foreground">
                              {owner.email}
                            </p>
                          </div>
                        ) : (
                          <span
                            className="text-sm text-muted-foreground"
                            title={`Landlord id ${property.landlordId}`}
                          >
                            Unknown owner
                          </span>
                        )}
                      </TableCell>

                      <TableCell className="whitespace-nowrap text-sm text-foreground">
                        {formatCurrency(property.price)}
                        <span className="text-muted-foreground">/mo</span>
                      </TableCell>

                      <TableCell>
                        <PropertyStatusBadge status={property.status} />
                      </TableCell>

                      <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                        {formatDate(property.createdAt)}
                      </TableCell>

                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            asChild
                            variant="outline"
                            size="sm"
                            className="rounded-xl border-border/60"
                          >
                            <Link href={`/properties/${property.id}`}>
                              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                              View
                            </Link>
                          </Button>

                          <Button
                            variant="ghost"
                            size="icon-sm"
                            className="rounded-xl text-muted-foreground hover:text-red-600"
                            onClick={() => setPendingDelete(property)}
                            disabled={isBusy}
                            aria-label={`Remove ${property.title}`}
                            title="Remove listing"
                          >
                            {isBusy ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                            ) : (
                              <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                            )}
                          </Button>
                        </div>
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
            label="properties"
          />
        ) : null}
      </div>)}

      <AlertDialog
        open={pendingDelete !== null}
        onOpenChange={(open) => !open && setPendingDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove “{pendingDelete?.title}”?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently deletes the listing and cannot be undone. The owner is
              not notified.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="rounded-xl bg-red-600 hover:bg-red-700 focus-visible:outline-red-600"
              onClick={confirmDelete}
            >
              Remove listing
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
