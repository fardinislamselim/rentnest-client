"use client";

import { PropertyForm } from "@/components/dashboard/property-form";
import { useCreateProperty } from "@/hooks/use-create-property";

export default function CreatePropertyForm() {
  const { createProperty, isSubmitting } = useCreateProperty();

  return (
    <PropertyForm
      mode="create"
      isSubmitting={isSubmitting}
      onSubmitProperty={async (data) => {
        const result = await createProperty(data);
        return Boolean(result);
      }}
    />
  );
}
