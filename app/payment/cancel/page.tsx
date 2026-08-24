import { XCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: import("next").Metadata = {
  title: "Payment Cancelled | RentNest",
  description: "Your payment was cancelled. You can try again at any time.",
};

export default function PaymentCancelPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-border/60 bg-card p-8 shadow-xl max-w-md text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/10">
          <XCircle className="h-8 w-8 text-amber-500" />
        </div>
        <h2 className="font-heading text-2xl font-bold text-foreground">
          Payment Cancelled
        </h2>
        <p className="text-sm text-muted-foreground">
          Your payment was cancelled. No charges were made to your card. You can
          try again at any time.
        </p>
        <div className="flex gap-3 mt-4">
          <Button asChild className="bg-blue-600 hover:bg-blue-700 rounded-xl">
            <Link href="/dashboard/rental-requests">
              Back to Rental Requests
            </Link>
          </Button>
          <Button asChild variant="outline" className="rounded-xl">
            <Link href="/dashboard">Dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
