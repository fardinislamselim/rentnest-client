import { notFound } from "next/navigation";

import EditPropertyForm from "@/components/dashboard/edit-property-form";
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

  let initialProperty: IProperty | undefined;
  try {
    initialProperty = await unwrapApiResponse(
      api.get<IApiResponse<IProperty>>(`/properties/${id}`),
    );
  } catch {
    initialProperty = undefined;
  }

  return (
    <EditPropertyForm
      propertyId={id}
      initialProperty={initialProperty}
    />
  );
}
