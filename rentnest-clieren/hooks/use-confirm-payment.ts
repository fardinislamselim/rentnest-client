"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { toast } from "sonner";

export interface ConfirmPaymentResult {
  id: string;
  status: string;
  paidAt: string | null;
  amount: number;
  rentalRequest: {
    id: string;
    status: string;
    property: {
      title: string;
      location: string;
    };
  };
}

export const useConfirmPayment = () => {
  const [isConfirming, setIsConfirming] = useState(false);
  const queryClient = useQueryClient();

  const confirmPayment = async (paymentId: string): Promise<ConfirmPaymentResult | null> => {
    setIsConfirming(true);
    try {
      const { data } = await api.post("/payments/confirm", {
        paymentId,
      });

      if (!data.success) {
        throw new Error(data.message || "Failed to confirm payment");
      }

      queryClient.invalidateQueries({ queryKey: ["my-payments"] });
      queryClient.invalidateQueries({ queryKey: ["rental-request"] });
      queryClient.invalidateQueries({ queryKey: ["my-rentals"] });
      queryClient.invalidateQueries({ queryKey: ["landlord-dashboard"] });

      return data.data;
    } catch (error) {
      const axiosError = error as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      const message =
        axiosError?.response?.data?.message ||
        axiosError?.message ||
        "Failed to confirm payment";
      toast.error(message);
      return null;
    } finally {
      setIsConfirming(false);
    }
  };

  return { confirmPayment, isConfirming };
};
