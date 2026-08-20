import React from "react";
import Container from "@/components/layout/container";
import PaymentClient from "@/components/dashboard/payment-client";

interface PaymentPageProps {
  params: Promise<{ rentalId: string }>;
}

export default async function PaymentPage({ params }: PaymentPageProps) {
  const { rentalId } = await params;

  return (
    <div className="min-h-screen bg-background py-10 lg:py-16">
      <Container>
        <PaymentClient rentalId={rentalId} />
      </Container>
    </div>
  );
}
