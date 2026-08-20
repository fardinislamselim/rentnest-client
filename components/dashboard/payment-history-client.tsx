"use client";

import React from "react";
import { FileText, CreditCard, Calendar, Hash, Building2 } from "lucide-react";
import { useMyPayments } from "@/hooks/use-my-payments";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

const STATUS_CONFIG: Record<
  string,
  {
    color: string;
    bgColor: string;
    label: string;
    dot: string;
  }
> = {
  COMPLETED: {
    color: "text-emerald-600 dark:text-emerald-400",
    bgColor: "bg-emerald-500/10",
    label: "Paid",
    dot: "bg-emerald-500",
  },
  PENDING: {
    color: "text-amber-600 dark:text-amber-400",
    bgColor: "bg-amber-500/10",
    label: "Pending",
    dot: "bg-amber-500",
  },
  FAILED: {
    color: "text-red-600 dark:text-red-400",
    bgColor: "bg-red-500/10",
    label: "Failed",
    dot: "bg-red-500",
  },
  CANCELLED: {
    color: "text-zinc-500 dark:text-zinc-400",
    bgColor: "bg-zinc-500/10",
    label: "Cancelled",
    dot: "bg-zinc-400",
  },
};

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(amount);

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-BD", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

function PaymentSkeleton() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2 border-b border-border/40 pb-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-96" />
      </div>
      <div className="rounded-2xl border border-border/60 bg-card shadow-sm overflow-hidden">
        <div className="border-b border-border/40 px-6 py-4">
          <Skeleton className="h-6 w-40" />
        </div>
        <div className="p-6 space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 py-4 border-b border-border/30 last:border-0">
              <Skeleton className="h-12 w-12 rounded-xl" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4 rounded" />
                <Skeleton className="h-3 w-1/2 rounded" />
              </div>
              <Skeleton className="h-4 w-24 rounded" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function PaymentHistoryClient() {
  const { data: payments, isLoading, error } = useMyPayments();

  if (isLoading) {
    return <PaymentSkeleton />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 mb-4">
          <CreditCard className="h-8 w-8 text-red-500" />
        </div>
        <h2 className="font-heading text-2xl font-bold text-foreground mb-2">
          Failed to Load Payments
        </h2>
        <p className="text-sm text-muted-foreground max-w-md mb-6">
          {error.message || "Something went wrong while fetching your payment history."}
        </p>
        <Button
          onClick={() => window.location.reload()}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
        >
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col gap-2 border-b border-border/40 pb-6">
        <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold text-xs uppercase tracking-wider">
          <CreditCard className="h-4 w-4" /> Payment History
        </div>
        <h1 className="font-heading text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          Payment History
        </h1>
        <p className="text-sm text-muted-foreground sm:text-base">
          View all your previous payments and their current status.
        </p>
      </div>

      {/* Payment Table */}
      <div className="rounded-2xl border border-border/60 bg-card shadow-sm overflow-hidden">
        {payments && payments.length > 0 ? (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/40 bg-muted/30">
                    <th className="text-left py-3 px-4 text-xs font-semibold uppercase text-muted-foreground">
                      Property
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-semibold uppercase text-muted-foreground">
                      Amount
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-semibold uppercase text-muted-foreground">
                      Date
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-semibold uppercase text-muted-foreground">
                      Transaction ID
                    </th>
                    <th className="text-center py-3 px-4 text-xs font-semibold uppercase text-muted-foreground">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment) => {
                    const statusConfig =
                      STATUS_CONFIG[payment.status] || STATUS_CONFIG.PENDING;
                    const propertyTitle =
                      payment.rentalRequest?.property?.title || "Unknown Property";

                    return (
                      <tr
                        key={payment.id}
                        className="border-b border-border/30 transition-colors hover:bg-muted/30"
                      >
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:bg-blue-400/10 dark:text-blue-400">
                              <Building2 className="h-5 w-5" />
                            </div>
                            <span className="font-medium text-foreground line-clamp-1">
                              {propertyTitle}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-sm font-medium text-foreground">
                            {formatCurrency(payment.amount)}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Calendar className="h-3.5 w-3.5 shrink-0 text-blue-500" />
                            {formatDate(payment.createdAt)}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-sm font-mono text-muted-foreground">
                            {payment.transactionId || "N/A"}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex justify-center">
                            <span
                              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${statusConfig.bgColor} ${statusConfig.color}`}
                            >
                              <span className={`h-2 w-2 rounded-full ${statusConfig.dot}`} />
                              {statusConfig.label}
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden divide-y divide-border/40">
              {payments.map((payment) => {
                const statusConfig =
                  STATUS_CONFIG[payment.status] || STATUS_CONFIG.PENDING;
                const propertyTitle =
                  payment.rentalRequest?.property?.title || "Unknown Property";

                return (
                  <div
                    key={payment.id}
                    className="flex flex-col gap-3 p-4 transition-colors hover:bg-muted/30"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:bg-blue-400/10 dark:text-blue-400">
                          <Building2 className="h-5 w-5" />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-medium text-foreground line-clamp-1">
                            {propertyTitle}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {formatCurrency(payment.amount)}
                          </span>
                        </div>
                      </div>
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${statusConfig.bgColor} ${statusConfig.color}`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${statusConfig.dot}`} />
                        {statusConfig.label}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground pl-13">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(payment.createdAt)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Hash className="h-3 w-3" />
                        {payment.transactionId
                          ? payment.transactionId.slice(0, 12) + "..."
                          : "N/A"}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-muted/30 mb-6">
              <FileText className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="font-heading text-xl font-bold text-foreground mb-2">
              No payment history found
            </h3>
            <p className="text-sm text-muted-foreground max-w-md mb-6">
              You haven&apos;t made any payments yet. Approved rental requests
              will appear here once you complete the payment.
            </p>
            <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl gap-2">
              <Link href="/dashboard/rental-requests" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                View Rental Requests
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
