import React from "react";
import Container from "@/components/layout/container";
import { getMe } from "@/service/getMe";
import { Key } from "lucide-react";
import LandlordDashboardContent from "@/components/dashboard/landlord-dashboard-content";

export default async function LandlordDashboardPage() {
  const user = await getMe();

  return (
    <div className="min-h-screen bg-background py-10 lg:py-16">
      <Container>
        <div className="flex flex-col gap-8">
          {/* Header */}
          <div className="flex flex-col gap-2 border-b border-border/40 pb-6">
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold text-xs uppercase tracking-wider">
              <Key className="h-4 w-4" /> Landlord Portal
            </div>
            <h1 className="font-heading text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              Welcome, {user?.name || "Landlord"}!
            </h1>
            <p className="text-sm text-muted-foreground sm:text-base">
              Manage your rental property listings, tenant requests, and earnings.
            </p>
          </div>

          <LandlordDashboardContent />
        </div>
      </Container>
    </div>
  );
}