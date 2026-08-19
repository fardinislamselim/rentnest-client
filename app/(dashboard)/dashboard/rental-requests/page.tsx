import React from "react";
import Container from "@/components/layout/container";
import { FileText } from "lucide-react";
import RentalRequestsList from "@/components/dashboard/rental-requests-list";

export const metadata = {
  title: "Rental Requests - RentNest",
  description: "View and manage your rental requests on RentNest.",
};

export default async function RentalRequestsPage() {

  return (
    <div className="min-h-screen bg-background py-10 lg:py-16">
      <Container>
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-2 border-b border-border/40 pb-6">
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold text-xs uppercase tracking-wider">
              <FileText className="h-4 w-4" /> Your Rental Activity
            </div>
            <h1 className="font-heading text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              Rental Requests
            </h1>
            <p className="text-sm text-muted-foreground sm:text-base">
              View all your rental requests, track their status, and manage
              payments for approved rentals.
            </p>
          </div>

          <RentalRequestsList />
        </div>
      </Container>
    </div>
  );
}
