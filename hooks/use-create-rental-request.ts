import { useState } from "react";
import { api } from "@/lib/axios";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

export interface CreateRentalRequestPayload {
  propertyId: string;
  startDate: string;
  endDate?: string;
}

export interface CreateRentalRequestResult {
  id: string;
  status: string;
  startDate: string;
  endDate: string | null;
  propertyId: string;
  tenantId: string;
  createdAt: string;
  updatedAt: string;
  property: {
    id: string;
    title: string;
    location: string;
    price: number;
    images: string[];
  };
}

export const useCreateRentalRequest = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const createRequest = async (
    payload: CreateRentalRequestPayload,
  ): Promise<CreateRentalRequestResult | null> => {
    setIsSubmitting(true);
    try {
      const { data } = await api.post("/rentals", payload);

      if (!data.success) {
        throw new Error(data.message || "Failed to submit rental request");
      }

      const result = data.data as CreateRentalRequestResult;
      toast.success("Rental request submitted successfully!");

      queryClient.invalidateQueries({ queryKey: ["my-rentals"] });

      return result;
    } catch (error) {
      const axiosError = error as { response?: { data?: { message?: string } }; message?: string };
      const message =
        axiosError?.response?.data?.message ||
        axiosError?.message ||
        "Failed to submit rental request";
      toast.error(message);
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { createRequest, isSubmitting };
};
