"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  FileText,
  Building2,
  Home,
  Calendar,
  CreditCard,
  ShieldCheck,
} from "lucide-react";
import { useRentalRequestDetail } from "@/hooks/use-rental-request-detail";
import { useCreatePaymentIntent } from "@/hooks/use-create-payment-intent";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

interface PaymentClientProps {
  rentalId: string;
}

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

function PaymentSkeleton() {
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

export default function PaymentClient({ rentalId }: PaymentClientProps) {
  const { data: rental, isLoading, error } = useRentalRequestDetail(rentalId);
  const { createIntent: createPaymentIntent, isCreating } =
    useCreatePaymentIntent();

  if (isLoading) {
    return <PaymentSkeleton />;
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

  if (rental.status !== "APPROVED") {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10 mb-4">
          <FileText className="h-8 w-8 text-amber-500" />
        </div>
        <h2 className="font-heading text-2xl font-bold text-foreground mb-2">
          Payment Not Available
        </h2>
        <p className="text-sm text-muted-foreground max-w-md mb-6">
          Payment is only available for approved rental requests. Current
          status: <span className="font-semibold">{rental.status}</span>
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
  const rentalDuration =
    rental.startDate && rental.endDate
      ? `${formatDate(rental.startDate)} - ${formatDate(rental.endDate)}`
      : `From ${formatDate(rental.startDate)}`;
  const totalAmount = property.price;

  const handlePayNow = async () => {
    const result = await createPaymentIntent(rental.id);
    if (result) {
      toast.success("Redirecting to payment gateway...");
    }
  };

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
            Payment Summary
          </h1>
          <p className="text-sm text-muted-foreground sm:text-base">
            Review your rental payment details and proceed to checkout.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Property & Rental Details */}
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

          {/* Rental Details */}
          <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold text-xs uppercase tracking-wider mb-4">
              <Calendar className="h-4 w-4" /> Rental Details
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
            </div>
          </div>
        </div>

        {/* Right Column: Payment Summary */}
        <div className="flex flex-col gap-6">
          <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold text-xs uppercase tracking-wider mb-4">
              <CreditCard className="h-4 w-4" /> Payment Summary
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between py-3 border-b border-border/40">
                <span className="text-sm text-muted-foreground">
                  Monthly Rent
                </span>
                <span className="text-sm font-medium text-foreground">
                  {formatCurrency(property.price)}
                </span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-border/40">
                <span className="text-sm text-muted-foreground">
                  Rental Duration
                </span>
                <span className="text-sm font-medium text-foreground">
                  {rental.startDate && rental.endDate
                    ? `${Math.ceil((new Date(rental.endDate).getTime() - new Date(rental.startDate).getTime()) / (1000 * 60 * 60 * 24 * 30))} month(s)`
                    : "1 month"}
                </span>
              </div>
              <div className="flex items-center justify-between py-3">
                <span className="text-base font-bold text-foreground">
                  Total Amount
                </span>
                <span className="text-base font-bold text-blue-600 dark:text-blue-400">
                  {formatCurrency(totalAmount)}
                </span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-border/40">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <ShieldCheck className="h-4 w-4 text-emerald-500" />
                  <span>Secure payment via Stripe</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CreditCard className="h-4 w-4 text-blue-500" />
                  <span>Credit / Debit Card</span>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <Button
                onClick={handlePayNow}
                disabled={isCreating}
                className="w-full bg-rose-500 hover:bg-rose-600 text-white rounded-xl py-5 font-semibold"
              >
                {isCreating ? (
                  <div className="flex items-center gap-2">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
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
          </div>
        </div>
      </div>
    </div>
  );
}
