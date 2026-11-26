import {
  DashboardStatsSkeleton,
  TableSkeleton,
} from "@/components/shared/Skeletons";

export default function TenantDashboardLoading() {
  return (
    <div className="space-y-8">
      <DashboardStatsSkeleton count={3} columns="md" />
      <TableSkeleton columns={5} rows={5} badge action />
    </div>
  );
}
