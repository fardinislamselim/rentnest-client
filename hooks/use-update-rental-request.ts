import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { toast } from "sonner";
import type { RentalRequest } from "@/types/rental";

export const useRentalRequestActions = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const approveRequest = async (requestId: string): Promise<RentalRequest | null> => {
    setIsSubmitting(true);
    try {
      const { data } = await api.patch(`/rentals/${requestId}/approve`);

      if (!data.success) {
        throw new Error(data.message || "Failed to approve request");
      }

      toast.success("Rental request approved successfully! ✅");

      queryClient.invalidateQueries({ queryKey: ["rental-requests"] });
      queryClient.invalidateQueries({ queryKey: ["landlord-dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["my-rentals"] });

      return data.data;
    } catch (error) {
      const axiosError = error as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      const message =
        axiosError?.response?.data?.message ||
        axiosError?.message ||
        "Failed to approve request";
      toast.error(message);
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  const rejectRequest = async (requestId: string): Promise<RentalRequest | null> => {
    setIsSubmitting(true);
    try {
      const { data } = await api.patch(`/rentals/${requestId}/reject`);

      if (!data.success) {
        throw new Error(data.message || "Failed to reject request");
      }

      toast.success("Rental request rejected.");

      queryClient.invalidateQueries({ queryKey: ["rental-requests"] });
      queryClient.invalidateQueries({ queryKey: ["landlord-dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["my-rentals"] });

      return data.data;
    } catch (error) {
      const axiosError = error as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      const message =
        axiosError?.response?.data?.message ||
        axiosError?.message ||
        "Failed to reject request";
      toast.error(message);
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { approveRequest, rejectRequest, isSubmitting };
};
