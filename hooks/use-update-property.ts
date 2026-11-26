import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { extractApiErrorMessage } from "@/lib/api-error";
import { api, unwrapApiResponse } from "@/lib/axios";
import { buildPropertyFormData } from "@/lib/property-form-data";
import type { IApiResponse } from "@/types/api";
import type { IProperty, PropertyStatus } from "@/types/property";

export interface UpdatePropertyPayload {
  title?: string;
  description?: string;
  location?: string;
  price?: number;
  bedrooms?: number;
  bathrooms?: number;
  size?: number;
  images?: string[];
  status?: PropertyStatus;
  categoryId?: string;
  primaryImageFile?: File | null;
  imageFiles?: File[];
}

export const useUpdateProperty = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const updateProperty = async (
    propertyId: string,
    payload: UpdatePropertyPayload,
  ): Promise<IProperty | null> => {
    setIsSubmitting(true);
    try {
      const formData = buildPropertyFormData(payload);
      const updated = await unwrapApiResponse(
        api.patch<IApiResponse<IProperty>>(
          `/properties/${propertyId}`,
          formData,
        ),
        "Failed to update property",
      );

      toast.success("Property updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["my-properties"] });
      queryClient.invalidateQueries({ queryKey: ["landlord-dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["property", propertyId] });

      return updated;
    } catch (error) {
      toast.error(extractApiErrorMessage(error, "Failed to update property"));
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { updateProperty, isSubmitting };
};
