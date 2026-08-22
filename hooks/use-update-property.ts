import { useState } from "react";
import { api } from "@/lib/axios";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import type { Property } from "@/types/property";

export interface UpdatePropertyPayload {
  title?: string;
  description?: string;
  location?: string;
  price?: number;
  bedrooms?: number;
  bathrooms?: number;
  size?: number;
  images?: string[];
  status?: "AVAILABLE" | "RENTED" | "UNAVAILABLE";
  categoryId?: string;
}

export const useUpdateProperty = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const updateProperty = async (
    propertyId: string,
    payload: UpdatePropertyPayload
  ): Promise<Property | null> => {
    setIsSubmitting(true);
    try {
      const { data } = await api.patch(`/properties/${propertyId}`, payload);
      if (!data.success) {
        throw new Error(data.message || "Failed to update property");
      }
      toast.success("Property updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["my-properties"] });
      queryClient.invalidateQueries({ queryKey: ["landlord-dashboard"] });
      return data.data;
    } catch (error) {
      const axiosError = error as { response?: { data?: { message?: string } }; message?: string };
      const message =
        axiosError?.response?.data?.message ||
        axiosError?.message ||
        "Failed to update property";
      toast.error(message);
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { updateProperty, isSubmitting };
};
