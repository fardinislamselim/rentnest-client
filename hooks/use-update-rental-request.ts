import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { extractApiErrorMessage } from "@/lib/api-error";
import { api, unwrapApiResponse } from "@/lib/axios";
import type { IApiResponse } from "@/types/api";
import type { RentalRequest } from "@/types/rental";

export const useRentalRequestActions = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const runRentalAction = async (
    endpoint: string,
    successMessage: string,
    fallbackError: string,
  ): Promise<RentalRequest | null> => {
    setIsSubmitting(true);
    try {
      const updated = await unwrapApiResponse(
        api.patch<IApiResponse<RentalRequest>>(endpoint),
        fallbackError,
      );

      toast.success(successMessage);

      queryClient.invalidateQueries({ queryKey: ["rental-requests"] });
      queryClient.invalidateQueries({ queryKey: ["landlord-dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["my-rentals"] });
      queryClient.invalidateQueries({ queryKey: ["my-properties"] });
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      queryClient.invalidateQueries({ queryKey: ["admin-rentals"] });

      return updated;
    } catch (error) {
      toast.error(extractApiErrorMessage(error, fallbackError));
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  const approveRequest = (requestId: string) =>
    runRentalAction(
      `/rentals/${requestId}/approve`,
      "Rental request approved successfully!",
      "Failed to approve request",
    );

  const rejectRequest = (requestId: string) =>
    runRentalAction(
      `/rentals/${requestId}/reject`,
      "Rental request rejected.",
      "Failed to reject request",
    );

  const completeRental = (requestId: string) =>
    runRentalAction(
      `/rentals/${requestId}/complete`,
      "Rental marked as completed and property is now available.",
      "Failed to mark rental as completed",
    );

  return { approveRequest, rejectRequest, completeRental, isSubmitting };
};
