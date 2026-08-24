import { Users } from "lucide-react";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminUsersTable } from "@/components/admin/admin-users-table";
import { getMe } from "@/service/getMe";

export default async function AdminUsersPage() {
  // Passed down so the signed-in admin cannot ban or delete their own account.
  const user = await getMe();

  return (
    <div className="mx-auto w-full max-w-7xl">
      <AdminPageHeader
        icon={Users}
        title="User management"
        description="Every account on the platform. Search by name or email, filter by role or status, and ban or unban tenants and landlords."
      />

      <AdminUsersTable currentUserId={user?.id} />
    </div>
  );
}
