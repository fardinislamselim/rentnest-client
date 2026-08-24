import { Building2 } from "lucide-react";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminPropertiesTable } from "@/components/admin/admin-properties-table";

export default function AdminPropertiesPage() {
  return (
    <div className="mx-auto w-full max-w-7xl">
      <AdminPageHeader
        icon={Building2}
        title="Property moderation"
        description="Every listing with its owner, rent and availability. Search, filter by state or category, open the public listing, or remove one that breaks the rules."
      />

      <AdminPropertiesTable />
    </div>
  );
}
