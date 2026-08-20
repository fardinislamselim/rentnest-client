import React from "react";
import Container from "@/components/layout/container";
import RentalRequestDetailClient from "@/components/dashboard/rental-request-detail-client";

interface RentalRequestDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function RentalRequestDetailPage({
  params,
}: RentalRequestDetailPageProps) {
  const { id } = await params;

  return (
    <div className="min-h-screen bg-background py-10 lg:py-16">
      <Container>
        <RentalRequestDetailClient id={id} />
      </Container>
    </div>
  );
}
