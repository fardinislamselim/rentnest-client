"use client";

import { useMyProperties } from "@/hooks/use-my-properties";
import LandlordPropertyCard from "@/components/property/landlord-property-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Building2 } from "lucide-react";

function PropertyCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm">
      <Skeleton className="aspect-[16/10] w-full" />
      <div className="p-5 space-y-3">
        <Skeleton className="h-3 w-16 rounded" />
        <Skeleton className="h-6 w-3/4 rounded" />
        <Skeleton className="h-4 w-1/2 rounded" />
        <div className="grid grid-cols-3 gap-2">
          <Skeleton className="h-8 w-full rounded" />
          <Skeleton className="h-8 w-full rounded" />
          <Skeleton className="h-8 w-full rounded" />
        </div>
        <div className="flex gap-2 pt-4">
          <Skeleton className="h-9 flex-1 rounded-xl" />
          <Skeleton className="h-9 flex-1 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export default function MyPropertiesList() {
  const { data: properties, isLoading, error } = useMyProperties();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <PropertyCardSkeleton key={i} />
        ))}
      </div>
    );
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
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-500/10 mb-6">
          <Building2 className="h-10 w-10 text-blue-600 dark:text-blue-400" />
        </div>
        <h3 className="font-heading text-xl font-semibold text-foreground mb-2">
          No properties listed yet
        </h3>
        <p className="text-sm text-muted-foreground max-w-md mb-6">
          Start earning by listing your first property on RentNest. It only
          takes a minute to get started.
        </p>
        <button
          onClick={() => (window.location.href = "/landlord-dashboard/create-property")}
          className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          Add Property
        </button>
      </div>
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
