"use client";

import Link from "next/link";
import { FileText } from "lucide-react";

import { PropertyForm } from "@/components/dashboard/property-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useProperty } from "@/hooks/use-property";
import { useUpdateProperty } from "@/hooks/use-update-property";
import type { IProperty } from "@/types/property";

interface EditPropertyFormProps {
  propertyId: string;
  initialProperty?: IProperty;
}

export default function EditPropertyForm({
  propertyId,
  initialProperty,
}: EditPropertyFormProps) {
  const {
    data: property,
    isLoading: propertyLoading,
    error: propertyError,
  } = useProperty(propertyId, initialProperty);
  const { updateProperty, isSubmitting } = useUpdateProperty();

  if (propertyLoading) {
    return (
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2 border-b border-border/40 pb-6">
          <Skeleton className="h-5 w-40 rounded" />
          <Skeleton className="mt-2 h-8 w-64 rounded" />
          <Skeleton className="mt-1 h-4 w-96 rounded" />
        </div>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <Card className="border-border/60">
              <CardContent className="space-y-4 p-6">
                <Skeleton className="h-4 w-12 rounded" />
                <Skeleton className="h-12 w-full rounded" />
                <Skeleton className="mt-4 h-4 w-12 rounded" />
                <Skeleton className="h-24 w-full rounded" />
              </CardContent>
            </Card>
          </div>
          <div className="space-y-6">
            <Skeleton className="h-48 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (propertyError || !property) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10">
          <FileText className="h-8 w-8 text-red-500" />
        </div>
        <h3 className="font-heading mb-2 text-lg font-semibold text-foreground">
          Property not found
        </h3>
        <p className="mb-6 max-w-md text-sm text-muted-foreground">
          {propertyError?.message ||
            "The property you are trying to edit does not exist."}
        </p>
        <Button asChild className="rounded-xl bg-blue-600 hover:bg-blue-700">
          <Link href="/landlord-dashboard/my-properties">
            Back to My Properties
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <PropertyForm
      mode="edit"
      initialProperty={property}
      isSubmitting={isSubmitting}
      onSubmitProperty={async (data) => {
        const result = await updateProperty(propertyId, data);
        return Boolean(result);
      }}
    />
  );
}
