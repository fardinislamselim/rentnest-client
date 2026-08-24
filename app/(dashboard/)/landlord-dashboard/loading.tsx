import DashboardSkeleton from "@/components/dashboard/dashboard-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function LandlordDashboardLoading() {
  return (
    <div className="flex flex-col gap-8 p-4 sm:p-6 lg:p-8">
      <div className="space-y-2">
        <Skeleton className="h-8 w-64 rounded" />
        <Skeleton className="h-4 w-96 rounded" />
      </div>
      <DashboardSkeleton count={6} columns="lg" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Skeleton className="h-64 w-full rounded-2xl" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    </div>
  );
}
