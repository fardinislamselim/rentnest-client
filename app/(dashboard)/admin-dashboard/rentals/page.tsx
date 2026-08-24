import { ClipboardList } from "lucide-react";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminRentalsTable } from "@/components/admin/admin-rentals-table";

export default function AdminRentalsPage() {
  return (
    <div className="mx-auto w-full max-w-7xl">
      <AdminPageHeader
        icon={ClipboardList}
        title="Rental requests"
        description="Every rental request across the platform — tenant, property, landlord, rent, request date and status."
      />

      <AdminRentalsTable />
    </div>
  );
}
