import React from "react";
import Container from "@/components/layout/container";
import { getMe } from "@/service/getMe";
import { Key, Building2, PlusCircle, List } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

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

          {/* Stats Cards */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="flex flex-col gap-4 rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:bg-blue-400/10 dark:text-blue-400">
                  <Building2 className="h-6 w-6" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold uppercase text-muted-foreground">
                    My Listings
                  </span>
                  <span className="font-heading text-lg font-bold text-foreground">
                    0 Properties
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4 rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:bg-amber-400/10 dark:text-amber-400">
                  <List className="h-6 w-6" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold uppercase text-muted-foreground">
                    Rental Requests
                  </span>
                  <span className="font-heading text-lg font-bold text-foreground">
                    0 Pending
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-col gap-4 rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
            <h2 className="font-heading text-xl font-bold text-foreground">
              Landlord Actions
            </h2>
            <div className="flex flex-wrap gap-4">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl gap-2 cursor-pointer">
                <PlusCircle className="h-4 w-4" /> Post New Property
              </Button>
              <Button asChild variant="outline" className="rounded-xl gap-2 cursor-pointer">
                <Link href="/properties">View All Public Properties</Link>
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}