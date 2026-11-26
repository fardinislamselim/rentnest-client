"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Building2,
  Calendar,
  CheckCircle,
  CheckCircle2,
  ChevronRight,
  Clock,
  CreditCard,
  FileText,
  Heart,
  Home,
  Settings,
  ShieldCheck,
  Wallet,
} from "lucide-react";

import { StatCard } from "@/components/dashboard/StatCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { DashboardStatsSkeleton } from "@/components/shared/Skeletons";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useMyPayments } from "@/hooks/use-my-payments";
import { useMyRentals } from "@/hooks/use-my-rentals";
import { useWishlist } from "@/hooks/useWishlist";
import type { RentalStatus } from "@/types/rental";
import type { User } from "@/types/user";

const STATUS_COLORS: Record<RentalStatus, string> = {
  PENDING:
    "border-amber-500/20 bg-amber-500/10 text-amber-600 dark:bg-amber-400/10 dark:text-amber-400",
  APPROVED:
    "border-blue-500/20 bg-blue-500/10 text-blue-600 dark:bg-blue-400/10 dark:text-blue-400",
  REJECTED:
    "border-red-500/20 bg-red-500/10 text-red-600 dark:bg-red-400/10 dark:text-red-400",
  ACTIVE:
    "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-400",
  COMPLETED:
    "border-purple-500/20 bg-purple-500/10 text-purple-600 dark:bg-purple-400/10 dark:text-purple-400",
};

const STATUS_ICONS: Record<RentalStatus, React.ElementType> = {
  PENDING: Clock,
  APPROVED: CheckCircle,
  REJECTED: CheckCircle2,
  ACTIVE: Home,
  COMPLETED: CheckCircle2,
};

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(amount);

const formatRelativeDate = (dateString: string) => {
  const date = new Date(dateString);
  const diffDays = Math.floor(
    (Date.now() - date.getTime()) / (1000 * 60 * 60 * 24),
  );
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString("en-BD", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const QUICK_ACTIONS = [
  {
    href: "/properties",
    label: "Explore New Properties",
    description: "Browse verified homes & apartments",
    icon: Building2,
    accent: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  },
  {
    href: "/dashboard/wishlist",
    label: "View Saved Wishlist",
    description: "Compare your shortlisted properties",
    icon: Heart,
    accent: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
  },
  {
    href: "/dashboard/payment-history",
    label: "Payment History",
    description: "Review receipts & completed invoices",
    icon: Wallet,
    accent: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  },
  {
    href: "/settings",
    label: "Account & Security Settings",
    description: "Update profile photo and password",
    icon: Settings,
    accent: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  },
];

export default function TenantDashboardContent({
  user,
}: {
  user?: User | null;
}) {
  const { data: rentals, isLoading: rentalsLoading } = useMyRentals();
  const { data: payments, isLoading: paymentsLoading } = useMyPayments();
  const { savedIds, isLoading: wishlistLoading } = useWishlist();

  const isLoading = rentalsLoading || paymentsLoading || wishlistLoading;
  const rentalsList = rentals || [];

  const activeRentals = rentalsList.filter((r) => r.status === "ACTIVE").length;
  const pendingRequests = rentalsList.filter(
    (r) => r.status === "PENDING",
  ).length;
  const totalSpent =
    payments
      ?.filter((p) => p.status === "COMPLETED")
      .reduce((sum, p) => sum + p.amount, 0) ?? 0;

  const recentRentals = rentalsList.slice(0, 5);

  return (
    <div className="flex flex-col gap-6">
      {/* 4-Card Primary KPI Row */}
      {isLoading ? (
        <DashboardStatsSkeleton count={4} columns="lg" />
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Active Rentals"
            value={activeRentals}
            subtitle="Currently ongoing stays"
            href="/dashboard/rental-requests?status=ACTIVE"
            icon={Home}
            accentClass="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
          />
          <StatCard
            label="Pending Requests"
            value={pendingRequests}
            subtitle="Awaiting landlord approval"
            href="/dashboard/rental-requests?status=PENDING"
            icon={Clock}
            accentClass="bg-amber-500/10 text-amber-600 dark:text-amber-400"
          />
          <StatCard
            label="Saved Properties"
            value={savedIds.size}
            subtitle="Shortlisted homes"
            href="/dashboard/wishlist"
            icon={Heart}
            accentClass="bg-rose-500/10 text-rose-600 dark:text-rose-400"
          />
          <StatCard
            label="Total Spent"
            value={formatCurrency(totalSpent)}
            subtitle="Completed payments"
            href="/dashboard/payment-history"
            icon={CreditCard}
            accentClass="bg-blue-500/10 text-blue-600 dark:text-blue-400"
          />
        </div>
      )}

      {/* Main Content Hierarchy */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left: Recent Rental Requests */}
        <Card className="border-border/60 bg-card lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between border-b border-border/40 pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileText
                className="h-5 w-5 text-blue-600 dark:text-blue-400"
                aria-hidden="true"
              />
              Recent Rental Requests
            </CardTitle>
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400"
            >
              <Link
                href="/dashboard/rental-requests"
                className="flex items-center gap-1"
              >
                View all
                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="pt-4">
            {rentalsLoading ? (
              <div className="divide-y divide-border/40">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-4 py-4">
                    <Skeleton className="h-14 w-20 rounded-xl" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-3/4 rounded" />
                      <Skeleton className="h-3 w-1/2 rounded" />
                    </div>
                    <Skeleton className="h-6 w-20 rounded-full" />
                  </div>
                ))}
              </div>
            ) : recentRentals.length === 0 ? (
              <EmptyState
                icon={FileText}
                title="No rental requests yet"
                description="Browse available properties and submit your first booking request."
                actionLabel="Browse Properties"
                actionHref="/properties"
                className="border-0 bg-transparent py-10"
              />
            ) : (
              <div className="divide-y divide-border/40">
                {recentRentals.map((rental) => {
                  const Icon =
                    STATUS_ICONS[rental.status as RentalStatus] || Clock;
                  const statusColor =
                    STATUS_COLORS[rental.status as RentalStatus] ||
                    STATUS_COLORS.PENDING;
                  const propertyImage =
                    rental.property?.images?.[0] ||
                    "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=400&q=80";

                  return (
                    <Link
                      key={rental.id}
                      href={`/dashboard/rental-requests/${rental.id}`}
                      className="flex items-center gap-4 rounded-xl py-3.5 transition-colors hover:bg-muted/30 first:pt-0 last:pb-0"
                    >
                      <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-xl bg-muted">
                        <Image
                          src={propertyImage}
                          alt={rental.property?.title || "Property"}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <h4 className="line-clamp-1 font-semibold text-foreground">
                          {rental.property?.title || "Unknown Property"}
                        </h4>
                        <p className="line-clamp-1 text-xs text-muted-foreground">
                          {rental.property?.location || "Unknown location"}
                        </p>
                        <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" aria-hidden="true" />
                            {formatRelativeDate(rental.createdAt)}
                          </span>
                          <span>•</span>
                          <span>
                            {rental.property?.price
                              ? `${formatCurrency(rental.property.price)}/mo`
                              : "N/A"}
                          </span>
                        </div>
                      </div>

                      <span
                        className={`inline-flex shrink-0 items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold ${statusColor}`}
                      >
                        <Icon className="h-3 w-3" aria-hidden="true" />
                        {rental.status}
                      </span>
                    </Link>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Right: Quick Actions & Account Summary */}
        <div className="flex flex-col gap-5">
          <Card className="border-border/60 bg-card">
            <CardHeader className="border-b border-border/40 pb-4">
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="divide-y divide-border/40 pt-2">
              {QUICK_ACTIONS.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="group flex items-center gap-3.5 py-3.5 transition-colors first:pt-2 last:pb-1"
                  >
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${item.accent}`}
                    >
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400">
                        {item.label}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                    <ChevronRight
                      className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </Link>
                );
              })}
            </CardContent>
          </Card>

          <Card className="border-border/60 bg-card">
            <CardContent className="flex items-center justify-between gap-3 p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <ShieldCheck className="h-5 w-5" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">
                    Account Status
                  </p>
                  <p className="text-sm font-bold text-foreground">
                    {user?.role ?? "TENANT"} • {user?.status ?? "ACTIVE"}
                  </p>
                </div>
              </div>
              <Link
                href="/settings"
                className="text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400"
              >
                Manage
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
