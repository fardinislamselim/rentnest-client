import { notFound } from "next/navigation";

import EditPropertyForm from "@/components/dashboard/edit-property-form";
import type { Category } from "@/hooks/use-categories";
import { api, unwrapApiResponse } from "@/lib/axios";
import type { IApiResponse } from "@/types/api";
import type { IProperty } from "@/types/property";

export const metadata: import("next").Metadata = {
  title: "Edit Property | RentNest Landlord Dashboard",
  description: "Update your property listing details, images, and availability.",
};

export default async function EditPropertyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!id) {
    notFound();
  }

  const [propertyRes, categoriesRes] = await Promise.allSettled([
    unwrapApiResponse(api.get<IApiResponse<IProperty>>(`/properties/${id}`)),
    api.get<IApiResponse<Category[]>>("/categories"),
  ]);

  const initialProperty =
    propertyRes.status === "fulfilled" ? propertyRes.value : undefined;
  const categories =
    categoriesRes.status === "fulfilled" &&
    categoriesRes.value.data?.success &&
    Array.isArray(categoriesRes.value.data.data)
      ? categoriesRes.value.data.data
      : [];

  return (
    <EditPropertyForm
      propertyId={id}
      initialProperty={initialProperty}
      categories={categories}
    />
  );
}
