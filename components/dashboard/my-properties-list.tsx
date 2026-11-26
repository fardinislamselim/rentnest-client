"use client";

import { useMyProperties } from "@/hooks/use-my-properties";
import LandlordPropertyCard from "@/components/property/landlord-property-card";
import { EmptyState } from "@/components/shared/EmptyState";
import { PropertyGridSkeleton } from "@/components/shared/Skeletons";
import { Building2 } from "lucide-react";

export default function MyPropertiesList() {
  const { data: properties, isLoading, error } = useMyProperties();

  if (isLoading) {
    return <PropertyGridSkeleton count={6} />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted/30 mb-4">
          <Building2 className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="font-heading text-lg font-semibold text-foreground mb-2">
          Failed to load properties
        </h3>
        <p className="text-sm text-muted-foreground max-w-md">
          There was an error loading your properties. Please try again later.
        </p>
      </div>
    );
  }

  if (!properties || properties.length === 0) {
    return (
      <EmptyState
        icon={Building2}
        title="No properties listed yet"
        description="Start earning by listing your first property on RentNest. It only takes a minute to get started."
        actionLabel="Add Property"
        actionHref="/landlord-dashboard/create-property"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map((property, i) => (
        <LandlordPropertyCard
          key={property.id}
          property={property}
          priorityImage={i < 3}
        />
      ))}
    </div>
  );
}
