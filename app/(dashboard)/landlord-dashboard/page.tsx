import LandlordDashboardContent from "@/components/dashboard/landlord-dashboard-content";
import { getMe } from "@/service/getMe";

export default async function LandlordDashboardPage() {
  const user = await getMe();

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
      <div className="flex flex-col gap-1 border-b border-border/40 pb-5">
        <h1 className="font-heading text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
          Welcome back, {user?.name || "Landlord"}
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage your property listings, incoming rental requests, and earnings.
        </p>
      </div>

      <LandlordDashboardContent user={user} />
    </div>
  );
}
