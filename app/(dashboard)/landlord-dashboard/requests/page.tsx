import Container from "@/components/layout/container";
import { FileText, Clock } from "lucide-react";
import RentalRequestsTable from "@/components/dashboard/rental-requests-table";

export const metadata: import("next").Metadata = {
  title: "Rental Requests | RentNest Landlord Dashboard",
  description:
    "Manage rental requests for your properties. Review, approve, or reject tenant applications.",
};

export default function LandlordRequestsPage() {
  return (
    <div className="min-h-screen bg-background py-10 lg:py-16">
      <Container>
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:bg-blue-400/10 dark:text-blue-400">
              <FileText className="h-5 w-5" />
            </div>
            <h1 className="font-heading text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              Rental Requests
            </h1>
          </div>
          <p className="text-sm text-muted-foreground sm:text-base">
            Review and manage tenant rental requests for your properties. Approve
            requests to start collecting rent, or reject applications that do not
          </p>
        </div>

        {/* Requests Table */}
        <div className="rounded-2xl border border-border/60 bg-card/80 shadow-sm">
          <div className="border-b border-border/40 px-6 py-4">
            <h2 className="font-heading text-xl font-bold text-foreground flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              All Rental Requests
            </h2>
          </div>
          <div className="p-6">
            <RentalRequestsTable />
          </div>
        </div>
      </Container>
    </div>
  );
}
