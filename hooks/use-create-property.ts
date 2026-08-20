import { useState } from "react";
import { api } from "@/lib/axios";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

export interface CreatePropertyPayload {
  title: string;
  description: string;
  location: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  size?: number;
  images: string[];
  status?: "AVAILABLE" | "RENTED" | "UNAVAILABLE";
  categoryId: string;
}

export interface CreatePropertyResult {
  id: string;
  title: string;
  description: string;
  location: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  size: number | null;
  images: string[];
  status: string;
  categoryId: string;
  landlordId: string;
  createdAt: string;
  updatedAt: string;
}

export const useCreateProperty = () => {
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

  const createProperty = async (
    payload: CreatePropertyPayload,
    imageFiles?: File[],
  ): Promise<CreatePropertyResult | null> => {
    setIsSubmitting(true);
    try {
      let images = [...payload.images];

      if (imageFiles && imageFiles.length > 0) {
        const uploadPromises = imageFiles.map((file) => uploadImageToImgbb(file));
        const uploadedUrls = await Promise.all(uploadPromises);
        images = [...images, ...uploadedUrls];
      }

      const { data } = await api.post("/properties", {
        ...payload,
        images,
      });

      if (!data.success) {
        throw new Error(data.message || "Failed to create property");
      }

      toast.success("Property created successfully!");

      queryClient.invalidateQueries({ queryKey: ["landlord-dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["my-properties"] });

      return data.data;
    } catch (error) {
      const axiosError = error as { response?: { data?: { message?: string } }; message?: string };
      const message =
        axiosError?.response?.data?.message ||
        axiosError?.message ||
        "Failed to create property";
      toast.error(message);
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { createProperty, isSubmitting, uploadImageToImgbb };
};
