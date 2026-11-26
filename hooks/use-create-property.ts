import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { extractApiErrorMessage } from "@/lib/api-error";
import { api, unwrapApiResponse } from "@/lib/axios";
import { buildPropertyFormData } from "@/lib/property-form-data";
import type { IApiResponse } from "@/types/api";
import type { IProperty, PropertyStatus } from "@/types/property";

export interface CreatePropertyPayload {
  title: string;
  description: string;
  location: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  size?: number;
  status?: PropertyStatus;
  categoryId: string;
  primaryImageFile?: File | null;
  imageFiles?: File[];
}

export const useCreateProperty = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const createProperty = async (
    payload: CreatePropertyPayload,
  ): Promise<IProperty | null> => {
    setIsSubmitting(true);
    try {
      const formData = buildPropertyFormData(payload);
      const created = await unwrapApiResponse(
        api.post<IApiResponse<IProperty>>("/properties", formData),
        "Failed to create property",
      );

      toast.success("Property created successfully!");
      queryClient.invalidateQueries({ queryKey: ["landlord-dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["my-properties"] });

      return created;
    } catch (error) {
      toast.error(extractApiErrorMessage(error, "Failed to create property"));
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { createProperty, isSubmitting };
};
