import CreatePropertyForm from "@/components/dashboard/create-property-form";
import type { Category } from "@/hooks/use-categories";
import { api } from "@/lib/axios";
import type { IApiResponse } from "@/types/api";

export const metadata = {
  title: "Create Property - RentNest",
  description: "Create a new rental property listing.",
};

export default async function CreatePropertyPage() {
  let categories: Category[] = [];
  try {
    const res = await api.get<IApiResponse<Category[]>>("/categories");
    if (res.data?.success && Array.isArray(res.data.data)) {
      categories = res.data.data;
    }
  } catch {
    categories = [];
  }

  return <CreatePropertyForm categories={categories} />;
}
