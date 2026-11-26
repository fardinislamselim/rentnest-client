import Container from "@/components/layout/container";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function PropertyCardSkeleton() {
  return (
    <div className="flex flex-col justify-between overflow-hidden rounded-2xl border border-border/60 bg-card p-0 shadow-sm">
      <Skeleton className="aspect-[16/10] w-full rounded-none" />

      <div className="flex flex-col gap-4 p-5">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-3 w-1/3 rounded" />
          <Skeleton className="h-5 w-3/4 rounded" />
          <Skeleton className="h-3 w-full rounded" />
        </div>

        <div className="grid grid-cols-3 gap-2 border-y border-border/50 py-3">
          <Skeleton className="h-4 w-full rounded" />
          <Skeleton className="h-4 w-full rounded" />
          <Skeleton className="h-4 w-full rounded" />
        </div>

        <Skeleton className="h-10 w-full rounded-xl" />
      </div>
    </div>
  );
}

export function PropertyGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
      {Array.from({ length: count }).map((_, i) => (
        <PropertyCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function PropertyDetailsSkeleton() {
  return (
    <div className="min-h-screen bg-background py-10 lg:py-16">
      <Container>
        <Skeleton className="mb-6 h-8 w-40 rounded" />

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="flex flex-col gap-6 lg:col-span-8">
            <Skeleton className="aspect-[16/10] w-full rounded-3xl" />

            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4 rounded" />
              <Skeleton className="h-4 w-1/2 rounded" />
            </div>

            <Skeleton className="h-24 w-full rounded-2xl" />

            <div className="space-y-3 rounded-2xl border border-border/60 bg-card p-6">
              <Skeleton className="h-5 w-32 rounded" />
              <Skeleton className="h-4 w-full rounded" />
              <Skeleton className="h-4 w-full rounded" />
              <Skeleton className="h-4 w-3/4 rounded" />
            </div>

            <div className="space-y-3 rounded-2xl border border-border/60 bg-card p-6">
              <Skeleton className="h-5 w-32 rounded" />
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-6 w-full rounded" />
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="sticky top-24 space-y-4 rounded-3xl border border-border/60 bg-card p-6">
              <Skeleton className="h-6 w-48 rounded" />
              <Skeleton className="h-4 w-full rounded" />
              <div className="mt-4 space-y-3">
                <Skeleton className="h-12 w-full rounded-xl" />
                <Skeleton className="h-12 w-full rounded-xl" />
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-border/40 pt-4">
                <Skeleton className="h-3 w-32 rounded" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

interface DashboardStatsSkeletonProps {
  count?: number;
  columns?: "sm" | "md" | "lg" | "xl";
}

export function DashboardStatsSkeleton({
  count = 6,
  columns = "md",
}: DashboardStatsSkeletonProps) {
  const colClass = {
    sm: "sm:grid-cols-2",
    md: "sm:grid-cols-2 lg:grid-cols-3",
    lg: "sm:grid-cols-2 lg:grid-cols-4",
    xl: "sm:grid-cols-3 lg:grid-cols-6",
  }[columns];

  return (
    <div className={`grid grid-cols-1 ${colClass} gap-6`}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex flex-col gap-4 rounded-2xl border border-border/60 bg-card p-6 shadow-sm"
        >
          <div className="flex items-center gap-3">
            <Skeleton className="h-12 w-12 rounded-xl" />
            <div className="flex flex-1 flex-col">
              <Skeleton className="h-3 w-24 rounded" />
              <Skeleton className="mt-1 h-6 w-16 rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

interface TableSkeletonProps {
  columns: number;
  rows?: number;
  avatar?: boolean;
  action?: boolean;
  badge?: boolean;
  striped?: boolean;
}

export function TableSkeleton({
  columns,
  rows = 5,
  avatar = false,
  action = false,
  badge = false,
  striped = true,
}: TableSkeletonProps) {
  const badgeIndex = action ? columns - 2 : columns - 1;

  return (
    <div className="overflow-hidden rounded-2xl border border-border/60 bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            {Array.from({ length: columns }).map((_, i) => (
              <TableHead key={i}>
                <Skeleton
                  className={`h-3 ${i === 0 && avatar ? "w-24" : "w-16"} rounded`}
                />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <TableRow
              key={rowIndex}
              className={striped && rowIndex % 2 === 1 ? "bg-muted/25" : undefined}
            >
              {Array.from({ length: columns }).map((_, colIndex) => {
                const isFirst = colIndex === 0;
                const isLast = colIndex === columns - 1;
                let widthClass = "w-20";
                if (isFirst && avatar) widthClass = "w-32";
                if (isLast && action) widthClass = "w-20";
                if (badge && colIndex === badgeIndex) widthClass = "w-20";

                return (
                  <TableCell key={colIndex}>
                    {isFirst && avatar ? (
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-9 w-9 rounded-full" />
                        <div className="space-y-1.5">
                          <Skeleton className="h-4 w-28 rounded" />
                          <Skeleton className="h-3 w-40 rounded" />
                        </div>
                      </div>
                    ) : isLast && action ? (
                      <div className="flex justify-end">
                        <Skeleton className="h-8 w-20 rounded-xl" />
                      </div>
                    ) : badge && colIndex === badgeIndex ? (
                      <Skeleton className="h-6 w-20 rounded-full" />
                    ) : isFirst ? (
                      <Skeleton className={`h-4 ${widthClass} rounded`} />
                    ) : isLast && !action && !badge ? (
                      <div className="flex justify-end">
                        <Skeleton className="h-6 w-20 rounded-full" />
                      </div>
                    ) : (
                      <Skeleton className={`h-4 ${widthClass} rounded`} />
                    )}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
