import React from "react";
import Container from "@/components/layout/container";
import { getMe } from "@/service/getMe";
import { UserCircle, Building2 } from "lucide-react";
import TenantDashboardContent from "@/components/dashboard/tenant-dashboard-content";

export default async function DashboardPage() {
  const user = await getMe();

  return (
    <div className="min-h-screen bg-background py-10 lg:py-16">
      <Container>
        <div className="flex flex-col gap-8">
          {/* Header */}
          <div className="flex flex-col gap-2 border-b border-border/40 pb-6">
            <h1 className="font-heading text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              Welcome Back{user?.name ? `, ${user.name}` : ""}!
            </h1>
            <p className="text-sm text-muted-foreground sm:text-base">
              Manage your rental activities, properties, and account settings.
            </p>
          </div>

          {/* User overview card */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="flex flex-col gap-4 rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:bg-blue-400/10 dark:text-blue-400">
                  <UserCircle className="h-6 w-6" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold uppercase text-muted-foreground">
                    Account Role
                  </span>
                  <span className="font-heading text-lg font-bold text-foreground">
                    {user?.role || "TENANT"}
                  </span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Email: {user?.email || "N/A"}
              </p>
            </div>

            <div className="flex flex-col gap-4 rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-400">
                  <Building2 className="h-6 w-6" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold uppercase text-muted-foreground">
                    Quick Browse
                  </span>
                  <span className="font-heading text-lg font-bold text-foreground">
                    Available Properties
                  </span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Explore new listings in your area.
              </p>
            </div>

            <div className="flex items-center justify-between flex-wrap gap-2 rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600 dark:bg-purple-400/10 dark:text-purple-400">
                  <Building2 className="h-6 w-6" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold uppercase text-muted-foreground">
                    Member Since
                  </span>
                  <span className="font-heading text-lg font-bold text-foreground">
                    {user?.createdAt
                      ? new Date(user.createdAt).toLocaleDateString("en-BD", {
                          year: "numeric",
                          month: "short",
                        })
                      : "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Tenant Dashboard: Stats, Recent Rentals & Quick Actions */}
          <TenantDashboardContent />
        </div>
      </Container>
    </div>
  );
}
