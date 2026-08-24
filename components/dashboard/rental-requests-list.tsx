"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Home,
  CheckCircle2,
  CreditCard,
  Calendar,
  Eye,
  MapPin,
} from "lucide-react";
import { useMyRentals } from "@/hooks/use-my-rentals";
import { useCreatePaymentIntent } from "@/hooks/use-create-payment-intent";
import { RentalStatus } from "@/types/rental";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import DashboardSkeleton from "@/components/dashboard/dashboard-skeleton";

// Color mapping for rental status badges
const STATUS_CONFIG: Record<
  RentalStatus,
  {
    color: string;
    bgColor: string;
    icon: React.ElementType;
    label: string;
  }
> = {
  PENDING: {
    color: "text-amber-600 dark:text-amber-400",
    bgColor: "bg-amber-500/10",
    icon: Clock,
    label: "Pending",
  },
  APPROVED: {
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-500/10",
    icon: CheckCircle,
    label: "Approved",
  },
  REJECTED: {
    color: "text-red-600 dark:text-red-400",
    bgColor: "bg-red-500/10",
    icon: XCircle,
    label: "Rejected",
  },
  ACTIVE: {
    color: "text-emerald-600 dark:text-emerald-400",
    bgColor: "bg-emerald-500/10",
    icon: Home,
    label: "Active",
  },
  COMPLETED: {
    color: "text-purple-600 dark:text-purple-400",
    bgColor: "bg-purple-500/10",
    icon: CheckCircle2,
    label: "Completed",
  },
};

// Format currency (BDT)
const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(amount);

// Format date
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-BD", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// Status badge pill
function StatusBadge({ status }: { status: RentalStatus }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.PENDING;
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${config.bgColor} ${config.color}`}
    >
      <Icon className="h-3 w-3" />
      {config.label}
    </span>
  );
}

// Table row skeleton
function TableRowSkeleton() {
  return (
    <div className="flex items-center gap-4 py-4 border-b border-border/40 last:border-0">
      <Skeleton className="h-16 w-20 rounded-xl" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4 rounded" />
        <Skeleton className="h-3 w-1/2 rounded" />
      </div>
      <Skeleton className="h-4 w-20 rounded" />
      <Skeleton className="h-4 w-24 rounded" />
      <Skeleton className="h-6 w-20 rounded-full" />
      <div className="flex gap-2">
        <Skeleton className="h-8 w-8 rounded-lg" />
        <Skeleton className="h-8 w-20 rounded-xl" />
      </div>
    </div>
  );
}

// Empty state
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-muted/30 mb-6">
        <FileText className="h-10 w-10 text-muted-foreground" />
      </div>
      <h3 className="font-heading text-xl font-bold text-foreground mb-2">
        No rental requests found
      </h3>
      <p className="text-sm text-muted-foreground max-w-md mb-6">
        You haven&apos;t submitted any rental requests yet. Browse properties and
        submit your first request!
      </p>
      <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl gap-2">
        <Link href="/properties" className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          Browse Properties
        </Link>
      </Button>
    </div>
  );
}

export default function RentalRequestsList() {
  const { data: rentals, isLoading, refetch } = useMyRentals();
  const { createIntent: createPaymentIntent, isCreating } =
    useCreatePaymentIntent();

  // Compute summary stats
  const rentalsList = rentals || [];

  const totalRentalRequests = rentalsList.length;
  const pendingRequests = rentalsList.filter((r) => r.status === "PENDING").length;
  const approvedRequests = rentalsList.filter((r) => r.status === "APPROVED").length;
  const activeRentals = rentalsList.filter((r) => r.status === "ACTIVE").length;
  const completedRentals = rentalsList.filter(
    (r) => r.status === "COMPLETED",
  ).length;

  // Stat card definitions
  const statCards = [
    {
      label: "Total Rental Requests",
      value: totalRentalRequests,
      icon: FileText,
      color: "bg-blue-500/10 text-blue-600 dark:bg-blue-400/10 dark:text-blue-400",
    },
    {
      label: "Pending Requests",
      value: pendingRequests,
      icon: Clock,
      color: "bg-amber-500/10 text-amber-600 dark:bg-amber-400/10 dark:text-amber-400",
    },
    {
      label: "Approved Requests",
      value: approvedRequests,
      icon: CheckCircle,
      color: "bg-blue-500/10 text-blue-600 dark:bg-blue-400/10 dark:text-blue-400",
    },
    {
      label: "Active Rentals",
      value: activeRentals,
      icon: Home,
      color: "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-400",
    },
    {
      label: "Completed Rentals",
      value: completedRentals,
      icon: CheckCircle2,
      color: "bg-purple-500/10 text-purple-600 dark:bg-purple-400/10 dark:text-purple-400",
    },
  ];

  const handlePayNow = async (rentalRequestId: string) => {
    await createPaymentIntent(rentalRequestId);
    refetch();
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Summary Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {isLoading ? (
          <DashboardSkeleton count={5} columns="md" />
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
                    <span className="font-heading text-2xl font-bold text-foreground">
                      {stat.value}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Rental Requests Table */}
      <div className="rounded-2xl border border-border/60 bg-card shadow-sm overflow-hidden">
        <div className="border-b border-border/40 px-6 py-4">
          <h2 className="font-heading text-xl font-bold text-foreground flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            All Rental Requests
          </h2>
        </div>

        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-6 space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <TableRowSkeleton key={i} />
              ))}
            </div>
          ) : rentalsList.length === 0 ? (
            <div className="p-8">
              <EmptyState />
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/40 bg-muted/30">
                  <th className="text-left py-3 px-4 text-xs font-semibold uppercase text-muted-foreground">
                    Property
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-semibold uppercase text-muted-foreground">
                    Location
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-semibold uppercase text-muted-foreground">
                    Rent
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-semibold uppercase text-muted-foreground">
                    Request Date
                  </th>
                  <th className="text-center py-3 px-4 text-xs font-semibold uppercase text-muted-foreground">
                    Status
                  </th>
                  <th className="text-center py-3 px-4 text-xs font-semibold uppercase text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {rentalsList.map((rental) => {
                  const property = rental.property;
                  const propertyImage =
                    property?.images?.[0] ||
                    "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80";
                  const propertyPrice = property?.price
                    ? formatCurrency(property.price)
                    : "N/A";
                  const isPaymentCompleted =
                    rental.payment?.status === "COMPLETED";
                  const canPayNow = rental.status === "APPROVED" && !isPaymentCompleted;

                  return (
                    <tr
                      key={rental.id}
                      className="border-b border-border/30 transition-colors hover:bg-muted/30"
                    >
                      {/* Property Image + Name */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative h-14 w-18 shrink-0 overflow-hidden rounded-xl bg-muted">
                            <Image
                              src={propertyImage}
                              alt={property?.title || "Property"}
                              fill
                              sizes="72px"
                              className="object-cover"
                            />
                          </div>
                          <div className="flex flex-col">
                            <span className="font-medium text-foreground line-clamp-1">
                              {property?.title || "Unknown Property"}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Location */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1 text-sm text-muted-foreground max-w-45">
                          <MapPin className="h-3.5 w-3.5 shrink-0 text-blue-500" />
                          <span className="truncate">
                            {property?.location || "N/A"}
                          </span>
                        </div>
                      </td>

                      {/* Rent */}
                      <td className="py-4 px-4">
                        <span className="text-sm font-medium text-foreground">
                          {propertyPrice}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {" "}
                          / month
                        </span>
                      </td>

                      {/* Request Date */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Calendar className="h-3.5 w-3.5 shrink-0 text-blue-500" />
                          {formatDate(rental.createdAt)}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4">
                        <div className="flex justify-center">
                          <StatusBadge status={rental.status as RentalStatus} />
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2 justify-center">
                          <Button
                            asChild
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 rounded-lg p-0"
                            title="View Details"
                          >
                            <Link
                              href={`/dashboard/rental-requests/${rental.id}`}
                            >
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>

                          {canPayNow && (
                            <Button
                              size="sm"
                              className="bg-rose-500 hover:bg-rose-600 text-white rounded-xl"
                              onClick={() => handlePayNow(rental.id)}
                              disabled={isCreating}
                            >
                              {isCreating ? (
                                <div className="flex items-center gap-1">
                                  <div className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                </div>
                              ) : (
                                <>
                                  <CreditCard className="h-3.5 w-3.5" /> Pay Now
                                </>
                              )}
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Mobile Card Layout (for smaller screens) */}
        <div className="hidden sm:block lg:hidden">
          {/* The table above already handles small screens reasonably */}
        </div>
      </div>
    </div>
  );
}
