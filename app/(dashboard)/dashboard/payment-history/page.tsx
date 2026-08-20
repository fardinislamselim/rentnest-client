import React from "react";
import Container from "@/components/layout/container";
import PaymentHistoryClient from "@/components/dashboard/payment-history-client";

export const metadata = {
  title: "Payment History - RentNest",
  description: "View your payment history on RentNest.",
};

export default async function PaymentHistoryPage() {
  return (
    <div className="min-h-screen bg-background py-10 lg:py-16">
      <Container>
        <PaymentHistoryClient />
      </Container>
    </div>
  );
}
