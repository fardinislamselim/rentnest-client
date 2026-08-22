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

  const uploadImageToImgbb = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("key", "7e7269e8b8a3e722e21a7b9b5781490a");
    formData.append("image", file);

    const response = await fetch("https://api.imgbb.com/1/upload", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error?.message || "Failed to upload image");
    }

    return result.data.url;
  };

  const updateProperty = async (
    propertyId: string,
    payload: UpdatePropertyPayload,
    imageFiles?: File[]
  ): Promise<Property | null> => {
    setIsSubmitting(true);
    try {
      let images = [...(payload.images || [])];

      if (imageFiles && imageFiles.length > 0) {
        const uploadPromises = imageFiles.map((file) => uploadImageToImgbb(file));
        const uploadedUrls = await Promise.all(uploadPromises);
        images = [...images, ...uploadedUrls];
      }

      const { data } = await api.patch(`/properties/${propertyId}`, {
        ...payload,
        images,
      });

      if (!data.success) {
        throw new Error(data.message || "Failed to update property");
      }

      toast.success("Property updated successfully!");

      queryClient.invalidateQueries({ queryKey: ["my-properties"] });
      queryClient.invalidateQueries({ queryKey: ["landlord-dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["property", propertyId] });

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
