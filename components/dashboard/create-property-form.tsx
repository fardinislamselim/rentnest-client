"use client";

import { useRouter } from "next/navigation";

import { PropertyForm } from "@/components/shared/PropertyForm";
import type { Category } from "@/hooks/use-categories";
import { useCreateProperty } from "@/hooks/use-create-property";

export default function CreatePropertyForm({
  categories,
}: {
  categories?: Category[];
}) {
  const router = useRouter();
  const { createProperty, isSubmitting } = useCreateProperty();

  return (
    <PropertyForm
      mode="create"
      categories={categories}
      isSubmitting={isSubmitting}
      onSubmitProperty={async (data) => {
        const result = await createProperty(data);
        if (result) {
          router.push("/landlord-dashboard/my-properties");
          router.refresh();
          return true;
        }
        return false;
      }}
    />
  );
}
