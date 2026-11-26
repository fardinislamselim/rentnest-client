import {
  DashboardStatsSkeleton,
  TableSkeleton,
} from "@/components/shared/Skeletons";

export default function LandlordDashboardLoading() {
  return (
    <div className="space-y-8">
      <DashboardStatsSkeleton count={4} columns="lg" />
      <TableSkeleton columns={6} rows={5} avatar badge action />
    </div>
  );
}
