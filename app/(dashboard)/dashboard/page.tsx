import TenantDashboardContent from "@/components/dashboard/tenant-dashboard-content";
import { getMe } from "@/service/getMe";

export default async function DashboardPage() {
  const user = await getMe();

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
      <div className="flex flex-col gap-1 border-b border-border/40 pb-5">
        <h1 className="font-heading text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
          Welcome back{user?.name ? `, ${user.name}` : ""}
        </h1>
        <p className="text-sm text-muted-foreground">
          Track your active stays, pending requests, saved homes, and payments.
        </p>
      </div>

      <TenantDashboardContent user={user} />
    </div>
  );
}
