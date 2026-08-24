"use client";

import Link from "next/link";
import {
  AlertTriangle,
  ArrowUpRight,
  Building2,
  ClipboardList,
  RefreshCw,
  Users,
} from "lucide-react";

import { AdminCharts } from "@/components/admin/admin-charts";
import { AdminStatTiles } from "@/components/admin/admin-stat-tiles";
import { Button } from "@/components/ui/button";
import {
  useAdminDashboard,
  useAdminRentalCounts,
} from "@/hooks/use-admin-dashboard";
import { formatNumber } from "@/lib/format";

const QUICK_LINKS = [
  {
    href: "/admin-dashboard/users",
    label: "User management",
    description: "Search, filter, ban or unban any account",
    icon: Users,
    accent: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
  },
  {
    href: "/admin-dashboard/properties",
    label: "Property moderation",
    description: "Review listings, owners and availability",
    icon: Building2,
    accent: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  },
  {
    href: "/admin-dashboard/rentals",
    label: "Rental requests",
    description: "Every request across the platform",
    icon: ClipboardList,
    accent: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  },
];

export function AdminOverview() {
  const {
    data: stats,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useAdminDashboard();

  const {
    counts,
    isLoading: countsLoading,
    isError: countsError,
  } = useAdminRentalCounts();

  return (
    <div className="space-y-6">
      {error ? (
        <div className="flex flex-col gap-3 rounded-2xl border border-red-500/30 bg-red-500/5 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <AlertTriangle
              className="mt-0.5 h-5 w-5 shrink-0 text-red-600 dark:text-red-400"
              aria-hidden="true"
            />
            <div>
              <p className="font-medium text-foreground">Could not load platform stats</p>
              <p className="mt-0.5 text-sm text-muted-foreground">{error.message}</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="shrink-0 rounded-xl border-border/60"
            onClick={() => refetch()}
          >
            <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
            Retry
          </Button>
        </div>
      ) : null}

      <AdminStatTiles
        stats={stats}
        rentalCounts={counts}
        isLoading={isLoading}
        countsLoading={countsLoading}
      />

      {countsError && !countsLoading ? (
        <p className="text-xs text-muted-foreground">
          Rental status counts could not be refreshed; the pipeline figures below may
          be incomplete.
        </p>
      ) : null}

      <AdminCharts
        stats={stats}
        counts={counts}
        isLoading={isLoading}
        countsLoading={countsLoading}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {QUICK_LINKS.map((link) => {
          const Icon = link.icon;

          return (
            <Link
              key={link.href}
              href={link.href}
              className="group flex items-start gap-4 rounded-2xl border border-border/60 bg-card p-5 transition-colors hover:border-primary/40 hover:bg-muted/40"
            >
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${link.accent}`}
              >
                <Icon className="h-5 w-5" aria-hidden="true" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-1.5 font-medium text-foreground">
                  {link.label}
                  <ArrowUpRight
                    className="h-3.5 w-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    aria-hidden="true"
                  />
                </p>
                <p className="mt-0.5 text-sm text-muted-foreground">{link.description}</p>
              </div>
            </Link>
          );
        })}
      </div>

      <p className="text-xs text-muted-foreground">
        {isFetching && !isLoading ? "Refreshing…" : null}
        {!isFetching && stats
          ? `Across ${formatNumber(stats.totalRentals)} rentals, ${formatNumber(stats.completedRentals)} have completed.`
          : null}
      </p>
    </div>
  );
}
