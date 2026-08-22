import { notFound } from "next/navigation";
import EditPropertyForm from "@/components/dashboard/edit-property-form";

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

  return <EditPropertyForm propertyId={id} />;
}
