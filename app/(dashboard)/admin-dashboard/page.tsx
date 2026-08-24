import { ShieldCheck } from "lucide-react";

import { AdminOverview } from "@/components/admin/admin-overview";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { getMe } from "@/service/getMe";

export default async function AdminDashboardPage() {
  const user = await getMe();

  return (
    <div className="mx-auto w-full max-w-7xl">
      <AdminPageHeader
        icon={ShieldCheck}
        title={`Admin console — ${user?.name || "Admin"}`}
        description="Platform-wide health: accounts, listings, rental pipeline and revenue."
      />

      <AdminOverview />
    </div>
  );
}
