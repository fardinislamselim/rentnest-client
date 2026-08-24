import DashboardSkeleton from "@/components/dashboard/dashboard-skeleton";
import TableSkeleton from "@/components/ui/table-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminDashboardLoading() {
  return (
    <div className="flex flex-col gap-8 p-4 sm:p-6 lg:p-8">
      <div className="space-y-2">
        <Skeleton className="h-8 w-64 rounded" />
        <Skeleton className="h-4 w-96 rounded" />
      </div>
      <DashboardSkeleton count={6} columns="lg" />
      <TableSkeleton columns={5} rows={8} avatar badge action />
    </div>
  );
}
