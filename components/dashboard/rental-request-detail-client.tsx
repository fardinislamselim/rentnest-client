"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  FileText,
  User,
  Building2,
  Calendar,
  CreditCard,
  Home,
} from "lucide-react";
import { useRentalRequestDetail } from "@/hooks/use-rental-request-detail";
import { RentalStatus } from "@/types/rental";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCreatePaymentIntent } from "@/hooks/use-create-payment-intent";

interface RentalRequestDetailClientProps {
  id: string;
}

const STATUS_CONFIG: Record<
  RentalStatus,
  {
    color: string;
    bgColor: string;
    label: string;
  }
> = {
  PENDING: {
    color: "text-amber-600 dark:text-amber-400",
    bgColor: "bg-amber-500/10",
    label: "Pending",
  },
  APPROVED: {
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-500/10",
    label: "Approved",
  },
  REJECTED: {
    color: "text-red-600 dark:text-red-400",
    bgColor: "bg-red-500/10",
    label: "Rejected",
  },
  ACTIVE: {
    color: "text-emerald-600 dark:text-emerald-400",
    bgColor: "bg-emerald-500/10",
    label: "Active",
  },
  COMPLETED: {
    color: "text-purple-600 dark:text-purple-400",
    bgColor: "bg-purple-500/10",
    label: "Completed",
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
    month: "long",
    day: "numeric",
  });
};

function DetailSkeleton() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2 border-b border-border/40 pb-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-96" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <Skeleton className="h-64 w-full rounded-2xl" />
          <Skeleton className="h-48 w-full rounded-2xl" />
        </div>
        <div className="flex flex-col gap-6">
          <Skeleton className="h-48 w-full rounded-2xl" />
        </div>
      </div>
    </div>
  );
}

export default function RentalRequestDetailClient({
  id,
}: RentalRequestDetailClientProps) {
  const { data: rental, isLoading, error } = useRentalRequestDetail(id);
  const { createIntent: createPaymentIntent, isCreating } =
    useCreatePaymentIntent();

  if (isLoading) {
    return <DetailSkeleton />;
  }

  if (error || !rental) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 mb-4">
          <FileText className="h-8 w-8 text-red-500" />
        </div>
        <h2 className="font-heading text-2xl font-bold text-foreground mb-2">
          Request Not Found
        </h2>
        <p className="text-sm text-muted-foreground max-w-md mb-6">
          The rental request you are looking for does not exist or you do not
          have permission to view it.
        </p>
        <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl">
          <Link href="/dashboard/rental-requests">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Requests
          </Link>
        </Button>
      </div>
    );
  }

  const property = rental.property;
  const statusConfig = STATUS_CONFIG[rental.status] || STATUS_CONFIG.PENDING;
  const isPaymentCompleted = rental.payment?.status === "COMPLETED";
  const canPayNow = rental.status === "APPROVED" && !isPaymentCompleted;

  const rentalDuration =
    rental.startDate && rental.endDate
      ? `${formatDate(rental.startDate)} - ${formatDate(rental.endDate)}`
      : `From ${formatDate(rental.startDate)}`;

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col gap-2 border-b border-border/40 pb-6">
        <Link
          href="/dashboard/rental-requests"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Requests
        </Link>
        <div className="flex flex-col gap-2 mt-2">
          <h1 className="font-heading text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Rental Request Details
          </h1>
          <p className="text-sm text-muted-foreground sm:text-base">
            View detailed information about your rental request.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Property & Request Info */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Property Card */}
          <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold text-xs uppercase tracking-wider mb-4">
              <Building2 className="h-4 w-4" /> Property Information
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-4">
                {property.images?.[0] && (
                  <div className="relative h-24 w-32 shrink-0 overflow-hidden rounded-xl bg-muted">
                    <Image
                      src={property.images[0]}
                      alt={property.title}
                      fill
                      sizes="128px"
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="flex flex-col gap-1">
                  <h3 className="font-heading text-lg font-bold text-foreground">
                    {property.title}
                  </h3>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Home className="h-3.5 w-3.5 text-blue-500" />
                    {property.location}
                  </p>
                  <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                    {formatCurrency(property.price)} / month
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border/40">
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-muted-foreground">Bedrooms</span>
                  <span className="text-sm font-bold text-foreground">
                    {property.bedrooms}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-muted-foreground">Bathrooms</span>
                  <span className="text-sm font-bold text-foreground">
                    {property.bathrooms}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-muted-foreground">Area</span>
                  <span className="text-sm font-bold text-foreground">
                    {property.size ?? "N/A"} sqft
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Request Details */}
          <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold text-xs uppercase tracking-wider mb-4">
              <FileText className="h-4 w-4" /> Request Details
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex flex-col gap-1">
                <span className="text-xs text-muted-foreground">Request ID</span>
                <span className="text-sm font-medium text-foreground font-mono">
                  {rental.id}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs text-muted-foreground">Request Date</span>
                <span className="text-sm font-medium text-foreground flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5 text-blue-500" />
                  {formatDate(rental.createdAt)}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs text-muted-foreground">Rental Duration</span>
                <span className="text-sm font-medium text-foreground">
                  {rentalDuration}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs text-muted-foreground">Monthly Rent</span>
                <span className="text-sm font-medium text-foreground">
                  {formatCurrency(property.price)}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs text-muted-foreground">Current Status</span>
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold w-fit ${statusConfig.bgColor} ${statusConfig.color}`}
                >
                  {rental.status}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Tenant, Landlord, Payment */}
        <div className="flex flex-col gap-6">
          {/* Tenant Info */}
          {rental.tenant && (
            <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
              <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold text-xs uppercase tracking-wider mb-4">
                <User className="h-4 w-4" /> Tenant Information
              </div>
              <div className="flex flex-col gap-3">
                <div>
                  <span className="text-xs text-muted-foreground">Name</span>
                  <p className="text-sm font-medium text-foreground">
                    {rental.tenant.name}
                  </p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Email</span>
                  <p className="text-sm font-medium text-foreground">
                    {rental.tenant.email}
                  </p>
                </div>
                {rental.tenant.phone && (
                  <div>
                    <span className="text-xs text-muted-foreground">Phone</span>
                    <p className="text-sm font-medium text-foreground">
                      {rental.tenant.phone}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Landlord Info */}
          {rental.landlord && (
            <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
              <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold text-xs uppercase tracking-wider mb-4">
                <User className="h-4 w-4" /> Landlord Information
              </div>
              <div className="flex flex-col gap-3">
                <div>
                  <span className="text-xs text-muted-foreground">Name</span>
                  <p className="text-sm font-medium text-foreground">
                    {rental.landlord.name}
                  </p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Email</span>
                  <p className="text-sm font-medium text-foreground">
                    {rental.landlord.email}
                  </p>
                </div>
                {rental.landlord.phone && (
                  <div>
                    <span className="text-xs text-muted-foreground">Phone</span>
                    <p className="text-sm font-medium text-foreground">
                      {rental.landlord.phone}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Payment Status */}
          <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold text-xs uppercase tracking-wider mb-4">
              <CreditCard className="h-4 w-4" /> Payment Status
            </div>
            {rental.payment ? (
              <div className="flex flex-col gap-3">
                <div>
                  <span className="text-xs text-muted-foreground">Status</span>
                  <p
                    className={`text-sm font-medium ${
                      rental.payment.status === "COMPLETED"
                        ? "text-emerald-600 dark:text-emerald-400"
                        : rental.payment.status === "FAILED"
                        ? "text-red-600 dark:text-red-400"
                        : "text-amber-600 dark:text-amber-400"
                    }`}
                  >
                    {rental.payment.status}
                  </p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Amount</span>
                  <p className="text-sm font-medium text-foreground">
                    {formatCurrency(rental.payment.amount)}
                  </p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Provider</span>
                  <p className="text-sm font-medium text-foreground capitalize">
                    {rental.payment.provider}
                  </p>
                </div>
                {rental.payment.transactionId && (
                  <div>
                    <span className="text-xs text-muted-foreground">
                      Transaction ID
                    </span>
                    <p className="text-sm font-medium text-foreground font-mono">
                      {rental.payment.transactionId}
                    </p>
                  </div>
                )}
                {rental.payment.paidAt && (
                  <div>
                    <span className="text-xs text-muted-foreground">
                      Paid At
                    </span>
                    <p className="text-sm font-medium text-foreground">
                      {formatDate(rental.payment.paidAt)}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted/30 mb-3">
                  <CreditCard className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">
                  No payment has been initiated yet.
                </p>
              </div>
            )}

            {canPayNow && (
              <div className="mt-4 pt-4 border-t border-border/40">
                <Button
                  onClick={() => createPaymentIntent(rental.id)}
                  disabled={isCreating}
                  className="w-full bg-rose-500 hover:bg-rose-600 text-white rounded-xl"
                >
                  {isCreating ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Processing...
                    </div>
                  ) : (
                    <>
                      <CreditCard className="h-4 w-4 mr-2" />
                      Pay Now
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
