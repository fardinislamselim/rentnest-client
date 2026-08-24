"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useConfirmPayment } from "@/hooks/use-confirm-payment";
import { Button } from "@/components/ui/button";
import { CheckCircle, Loader2, XCircle } from "lucide-react";
import Link from "next/link";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const paymentId = searchParams.get("payment_id");
  const { confirmPayment, isConfirming } = useConfirmPayment();

  useEffect(() => {
    if (!paymentId) return;
    confirmPayment(paymentId);
  }, [paymentId, confirmPayment]);

  if (!paymentId) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-border/60 bg-card p-8 shadow-xl">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10">
            <XCircle className="h-8 w-8 text-red-500" />
          </div>
          <h2 className="font-heading text-xl font-semibold text-foreground">
            Payment ID Not Found
          </h2>
          <p className="text-sm text-muted-foreground text-center max-w-md">
            We could not find the payment reference in the URL. Please try
            again or contact support if the issue persists.
          </p>
          <Button asChild className="bg-blue-600 hover:bg-blue-700 rounded-xl">
            <Link href="/dashboard/payment-history">Back to Payments</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (isConfirming) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-border/60 bg-card p-8 shadow-xl">
          <Loader2 className="h-10 w-10 animate-spin text-blue-600 dark:text-blue-400" />
          <h2 className="font-heading text-xl font-semibold text-foreground">
            Verifying your payment...
          </h2>
          <p className="text-sm text-muted-foreground">
            Please wait while we confirm your Stripe payment.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-border/60 bg-card p-8 shadow-xl max-w-md text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10">
          <CheckCircle className="h-8 w-8 text-emerald-500" />
        </div>
        <h2 className="font-heading text-2xl font-bold text-foreground">
          Payment Successful! ✅
        </h2>
        <p className="text-sm text-muted-foreground">
          Your rental payment has been confirmed. The property is now officially
          rented under your name.
        </p>
        <div className="flex gap-3 mt-4">
          <Button asChild className="bg-blue-600 hover:bg-blue-700 rounded-xl">
            <Link href="/dashboard/payment-history">View Payment History</Link>
          </Button>
          <Button asChild variant="outline" className="rounded-xl">
            <Link href="/dashboard">Back to Dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
