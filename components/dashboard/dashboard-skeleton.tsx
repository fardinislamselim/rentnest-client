import { Skeleton } from "@/components/ui/skeleton";

interface DashboardSkeletonProps {
  count?: number;
  columns?: "sm" | "md" | "lg" | "xl";
}

export default function DashboardSkeleton({
  count = 6,
  columns = "md",
}: DashboardSkeletonProps) {
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
            <div className="flex flex-col flex-1">
              <Skeleton className="h-3 w-24 rounded" />
              <Skeleton className="h-6 w-16 rounded mt-1" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
