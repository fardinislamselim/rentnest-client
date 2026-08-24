"use client";

import {
  Building2,
  ClipboardList,
  Home,
  KeyRound,
  Users,
  Wallet,
} from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency, formatCurrencyCompact, formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { AdminDashboardStats, AdminRentalCounts } from "@/types/admin";

interface AdminStatTilesProps {
  stats: AdminDashboardStats | undefined;
  rentalCounts: AdminRentalCounts;
  isLoading: boolean;
  countsLoading: boolean;
}

interface Tile {
  key: string;
  label: string;
  value: string;
  /** Full-precision value surfaced on hover when the tile shows a compact form. */
  title?: string;
  hint: string;
  icon: React.ElementType;
  accent: string;
  pending: boolean;
  wide?: boolean;
}

function TileShell({ tile }: { tile: Tile }) {
  const Icon = tile.icon;

  return (
    <div
      className={cn(
        "rounded-2xl border border-border/60 bg-card p-5 transition-colors hover:border-border",
        tile.wide && "sm:col-span-2",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-muted-foreground">{tile.label}</p>
        <div
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
            tile.accent,
          )}
        >
          <Icon className="h-4.5 w-4.5" aria-hidden="true" />
        </div>
      </div>

      {tile.pending ? (
        <Skeleton className="mt-3 h-9 w-24 rounded-lg" />
      ) : (
        // Proportional figures: these are standalone values, not a numeric column.
        <p
          className="mt-2 font-heading text-3xl font-bold tracking-tight text-foreground"
          title={tile.title}
        >
          {tile.value}
        </p>
      )}

      <p className="mt-1 text-xs text-muted-foreground">{tile.hint}</p>
    </div>
  );
}

export function AdminStatTiles({
  stats,
  rentalCounts,
  isLoading,
  countsLoading,
}: AdminStatTilesProps) {
  const num = (value: number | undefined) =>
    value === undefined ? "—" : formatNumber(value);

  const tiles: Tile[] = [
    {
      key: "users",
      label: "Total Users",
      value: num(stats?.totalUsers),
      hint: "Every registered account",
      icon: Users,
      accent: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
      pending: isLoading,
    },
    {
      key: "tenants",
      label: "Total Tenants",
      value: num(stats?.totalTenants),
      hint: "Accounts with the TENANT role",
      icon: Users,
      accent: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
      pending: isLoading,
    },
    {
      key: "landlords",
      label: "Total Landlords",
      value: num(stats?.totalLandlords),
      hint: "Accounts with the LANDLORD role",
      icon: KeyRound,
      accent: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
      pending: isLoading,
    },
    {
      key: "properties",
      label: "Total Properties",
      value: num(stats?.totalProperties),
      hint:
        stats === undefined
          ? "Listings on the platform"
          : `${formatNumber(stats.availableProperties)} available · ${formatNumber(stats.rentedProperties)} rented`,
      icon: Building2,
      accent: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
      pending: isLoading,
    },
    {
      key: "pending",
      label: "Pending Requests",
      value: num(countsLoading ? undefined : rentalCounts.PENDING),
      hint: "Rental requests awaiting a decision",
      icon: ClipboardList,
      accent: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
      pending: countsLoading,
    },
    {
      key: "active",
      label: "Active Rentals",
      value: num(countsLoading ? undefined : rentalCounts.ACTIVE),
      hint: "Tenancies currently running",
      icon: Home,
      accent: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
      pending: countsLoading,
    },
    {
      key: "revenue",
      label: "Total Revenue",
      value:
        stats === undefined ? "—" : formatCurrencyCompact(stats.totalRevenue),
      title: stats === undefined ? undefined : formatCurrency(stats.totalRevenue),
      hint: `Sum of completed payments${
        stats === undefined ? "" : ` · ${formatNumber(stats.totalRentals)} rentals all-time`
      }`,
      icon: Wallet,
      accent: "bg-primary/10 text-primary",
      pending: isLoading,
      wide: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {tiles.map((tile) => (
        <TileShell key={tile.key} tile={tile} />
      ))}
    </div>
  );
}
