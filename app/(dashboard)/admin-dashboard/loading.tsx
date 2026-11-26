import {
  DashboardStatsSkeleton,
  TableSkeleton,
} from "@/components/shared/Skeletons";

export default function AdminDashboardLoading() {
  return (
    <div className="space-y-8">
      <DashboardStatsSkeleton count={6} columns="xl" />
      <TableSkeleton columns={6} rows={5} avatar badge />
    </div>
  );
}
