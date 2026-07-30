import type { Metadata } from "next";
import { Suspense } from "react";
import Container from "@/components/layout/container";
import PropertiesSection from "@/components/sections/properties-section";
import PropertyCardSkeleton from "@/components/property/property-card-skeleton";

export const metadata: Metadata = {
  title: "Explore Rental Properties | RentNest",
  description: "Browse available rental properties across Bangladesh. Filter by location, property category, or budget.",
};

function PropertiesLoadingFallback() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mt-10">
      {Array.from({ length: 6 }).map((_, i) => (
        <PropertyCardSkeleton key={i} />
      ))}
    </div>
  );
}

export default function PropertiesPage() {
  return (
    <div className="min-h-screen bg-background py-10 lg:py-16">
      <Container>
        {/* Header */}
        <div className="flex flex-col gap-4 mb-8">
          <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
            Explore All Properties
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base max-w-2xl">
            Browse available rentals across Bangladesh. Use the filters below to narrow down by location, property type, or budget.
          </p>
        </div>

        {/* Interactive Properties Section wrapped in Suspense for useSearchParams */}
        <Suspense fallback={<PropertiesLoadingFallback />}>
          <PropertiesSection />
        </Suspense>
      </Container>
    </div>
  );
}
