"use client";

import { Building2, Home, Users, Wallet } from "lucide-react";

import { StatCard } from "@/components/dashboard/StatCard";
import { DashboardStatsSkeleton } from "@/components/shared/Skeletons";
import { formatCurrencyCompact, formatNumber } from "@/lib/format";
import type { AdminDashboardStats, AdminRentalCounts } from "@/types/admin";

interface AdminStatTilesProps {
  stats: AdminDashboardStats | undefined;
  rentalCounts: AdminRentalCounts;
  isLoading: boolean;
  countsLoading: boolean;
}

export function AdminStatTiles({
  stats,
  rentalCounts,
  isLoading,
  countsLoading,
}: AdminStatTilesProps) {
  if (isLoading || countsLoading) {
    return <DashboardStatsSkeleton count={4} columns="lg" />;
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        label="Total Users"
        value={stats ? formatNumber(stats.totalUsers) : "—"}
        subtitle={
          stats
            ? `${formatNumber(stats.totalTenants)} tenants · ${formatNumber(stats.totalLandlords)} landlords`
            : "Every registered account"
        }
        href="/admin-dashboard/users"
        icon={Users}
        accentClass="bg-violet-500/10 text-violet-600 dark:text-violet-400"
      />
      <StatCard
        label="Total Properties"
        value={stats ? formatNumber(stats.totalProperties) : "—"}
        subtitle={
          stats
            ? `${formatNumber(stats.availableProperties)} available · ${formatNumber(stats.rentedProperties)} rented`
            : "Listings on the platform"
        }
        href="/admin-dashboard/properties"
        icon={Building2}
        accentClass="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
      />
      <StatCard
        label="Active Rentals"
        value={formatNumber(rentalCounts.ACTIVE)}
        subtitle={`${formatNumber(rentalCounts.PENDING)} pending approval`}
        href="/admin-dashboard/rentals"
        icon={Home}
        accentClass="bg-blue-500/10 text-blue-600 dark:text-blue-400"
      />
      <StatCard
        label="Total Revenue"
        value={stats ? formatCurrencyCompact(stats.totalRevenue) : "—"}
        subtitle={
          stats
            ? `${formatNumber(stats.completedRentals)} completed rentals`
            : "Sum of completed payments"
        }
        href="/admin-dashboard/rentals"
        icon={Wallet}
        accentClass="bg-amber-500/10 text-amber-600 dark:text-amber-400"
      />
    </div>
  );
}
