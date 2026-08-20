"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  FileText,
  Clock,
  CheckCircle,
  Home,
  CheckCircle2,
  CreditCard,
  Building2,
  Calendar,
  Eye,
  History,
} from "lucide-react";
import { useMyRentals } from "@/hooks/use-my-rentals";
import { useMyPayments } from "@/hooks/use-my-payments";
import { RentalStatus } from "@/types/rental";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

// Color mapping for rental status badges
const STATUS_COLORS: Record<RentalStatus, string> = {
  PENDING:
    "bg-amber-500/10 text-amber-600 dark:bg-amber-400/10 dark:text-amber-400 border-amber-500/20",
  APPROVED:
    "bg-blue-500/10 text-blue-600 dark:bg-blue-400/10 dark:text-blue-400 border-blue-500/20",
  REJECTED:
    "bg-red-500/10 text-red-600 dark:bg-red-400/10 dark:text-red-400 border-red-500/20",
  ACTIVE:
    "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-400 border-emerald-500/20",
  COMPLETED:
    "bg-purple-500/10 text-purple-600 dark:bg-purple-400/10 dark:text-purple-400 border-purple-500/20",
};

const STATUS_ICONS: Record<RentalStatus, React.ElementType> = {
  PENDING: Clock,
  APPROVED: CheckCircle,
  REJECTED: CheckCircle2,
  ACTIVE: Home,
  COMPLETED: CheckCircle2,
};

// Stat card definitions
const STAT_ICONS = {
  total: FileText,
  pending: Clock,
  approved: CheckCircle,
  active: Home,
  completed: CheckCircle2,
  payment: CreditCard,
};

// Format currency (BDT)
const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(amount);

// Format date relative
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffDays = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return date.toLocaleDateString("en-BD", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

function StatCardSkeleton() {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <Skeleton className="h-12 w-12 rounded-xl" />
        <div className="flex flex-col flex-1">
          <Skeleton className="h-3 w-20 rounded" />
          <Skeleton className="h-6 w-16 rounded mt-1" />
        </div>
      </div>
      <Skeleton className="h-3 w-full max-w-[200px] rounded mt-2" />
    </div>
  );
}

function RecentRentalSkeleton() {
  return (
    <div className="divide-y divide-border/40">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 py-4">
          <Skeleton className="h-16 w-24 rounded-xl" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4 rounded" />
            <Skeleton className="h-3 w-1/2 rounded" />
          </div>
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
      ))}
    </div>
  );
}

export default function TenantDashboardContent() {
  const { data: rentals, isLoading: rentalsLoading } = useMyRentals();
  const { data: payments, isLoading: paymentsLoading } = useMyPayments();

  const isLoading = rentalsLoading || paymentsLoading;

  // Compute summary stats from rentals
  const rentalsList = rentals || [];

  const totalRentalRequests = rentalsList.length;
  const pendingRequests = rentalsList.filter(
    (r) => r.status === "PENDING",
  ).length;
  const approvedRequests = rentalsList.filter(
    (r) => r.status === "APPROVED",
  ).length;
  const activeRentals = rentalsList.filter(
    (r) => r.status === "ACTIVE",
  ).length;
  const completedRentals = rentalsList.filter(
    (r) => r.status === "COMPLETED",
  ).length;

  // Total payment (sum of completed payments)
  const totalPayment =
    payments?.filter((p) => p.status === "COMPLETED").reduce(
      (sum, p) => sum + p.amount,
      0,
    ) ?? 0;

  // Recent rental requests (last 5)
  const recentRentals = rentalsList.slice(0, 5);

  // Stat card data
  const statCards = [
    {
      label: "Total Rental Requests",
      value: totalRentalRequests,
      icon: STAT_ICONS.total,
      color: "bg-blue-500/10 text-blue-600 dark:bg-blue-400/10 dark:text-blue-400",
      valueColor: "text-foreground",
    },
    {
      label: "Pending Requests",
      value: pendingRequests,
      icon: STAT_ICONS.pending,
      color: "bg-amber-500/10 text-amber-600 dark:bg-amber-400/10 dark:text-amber-400",
      valueColor: "text-amber-600 dark:text-amber-400",
    },
    {
      label: "Approved Requests",
      value: approvedRequests,
      icon: STAT_ICONS.approved,
      color: "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-400",
      valueColor: "text-emerald-600 dark:text-emerald-400",
    },
    {
      label: "Active Rentals",
      value: activeRentals,
      icon: STAT_ICONS.active,
      color: "bg-indigo-500/10 text-indigo-600 dark:bg-indigo-400/10 dark:text-indigo-400",
      valueColor: "text-indigo-600 dark:text-indigo-400",
    },
    {
      label: "Completed Rentals",
      value: completedRentals,
      icon: STAT_ICONS.completed,
      color: "bg-purple-500/10 text-purple-600 dark:bg-purple-400/10 dark:text-purple-400",
      valueColor: "text-purple-600 dark:text-purple-400",
    },
    {
      label: "Total Payment",
      value: formatCurrency(totalPayment),
      icon: STAT_ICONS.payment,
      color: "bg-rose-500/10 text-rose-600 dark:bg-rose-400/10 dark:text-rose-400",
      valueColor: "text-rose-600 dark:text-rose-400",
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      {/* Summary Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <StatCardSkeleton key={i} />
          ))
        ) : (
          statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: statCards.indexOf(stat) * 0.08 }}
                className="flex flex-col gap-4 rounded-2xl border border-border/60 bg-card p-6 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.color}`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold uppercase text-muted-foreground">
                      {stat.label}
                    </span>
                    <span
                      className={`font-heading text-2xl font-bold ${stat.valueColor}`}
                    >
                      {stat.value}
                    </span>
                  </div>
                </div>
                {stat.label === "Total Payment" && totalPayment > 0 && (
                  <p className="text-xs text-muted-foreground">
                    Based on {payments?.filter((p) => p.status === "COMPLETED").length ?? 0}{" "}
                    completed payment(s)
                  </p>
                )}
              </motion.div>
            );
          })
        )}
      </div>

      {/* Recent Rental Requests */}
      <Card className="border-border/60 bg-card/80 dark:bg-zinc-900/80 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            Recent Rental Requests
          </CardTitle>
        </CardHeader>
        <CardContent>
          {rentalsLoading ? (
            <RecentRentalSkeleton />
          ) : recentRentals.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted/30 mb-4">
                <FileText className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="font-heading text-lg font-semibold text-foreground mb-2">
                No rental requests yet
              </h3>
              <p className="text-sm text-muted-foreground max-w-md">
                You have not submitted any rental requests. Browse properties and
                submit your first request!
              </p>
              <Button asChild className="mt-6 bg-blue-600 hover:bg-blue-700 rounded-xl">
                <Link href="/properties" className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  Browse Properties
                </Link>
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-border/40">
              {recentRentals.map((rental) => {
                const Icon = STATUS_ICONS[rental.status as RentalStatus] || Clock;
                const statusColor =
                  STATUS_COLORS[rental.status as RentalStatus] ||
                  STATUS_COLORS.PENDING;
                const propertyImage =
                  rental.property?.images?.[0] ||
                  "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80";
                const propertyPrice = rental.property?.price
                  ? formatCurrency(rental.property.price)
                  : "N/A";

                return (
                  <div
                    key={rental.id}
                    className="flex items-center gap-4 py-4 first:pt-0 last:pb-0"
                  >
                    <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-xl bg-muted">
                      <Image
                        src={propertyImage}
                        alt={rental.property?.title || "Property"}
                        fill
                        sizes="96px"
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-foreground line-clamp-1">
                        {rental.property?.title || "Unknown Property"}
                      </h4>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {rental.property?.location || "Unknown location"}
                      </p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(rental.createdAt)}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-muted-foreground/40" />
                        <span>{propertyPrice} / month</span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold ${statusColor}`}
                      >
                        <Icon className="h-3 w-3" />
                        {rental.status}
                      </span>
                      {rental.payment && rental.payment.status === "COMPLETED" && (
                        <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                          Paid
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="flex flex-col gap-4 rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
        <h2 className="font-heading text-xl font-bold text-foreground">
          Quick Actions
        </h2>
        <div className="flex flex-wrap gap-4">
          <Button
            asChild
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl gap-2 cursor-pointer"
          >
            <Link href="/properties" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Browse Properties
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="rounded-xl gap-2 cursor-pointer"
          >
            <Link href="/dashboard/payment-history" className="flex items-center gap-2">
              <History className="h-4 w-4" />
              Payment History
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="rounded-xl gap-2 cursor-pointer"
          >
            <Link href="/" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              View Saved Homes
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
