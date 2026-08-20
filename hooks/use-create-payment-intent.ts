"use client";

import { useState } from "react";
import { api } from "@/lib/axios";
import { toast } from "sonner";

export interface CreatePaymentIntentResult {
  paymentId: string;
  checkoutUrl: string;
  sessionId: string;
  amount: number;
  currency: string;
}

export const useCreatePaymentIntent = () => {
  const [isCreating, setIsCreating] = useState(false);

  const createIntent = async (
    rentalRequestId: string,
  ): Promise<CreatePaymentIntentResult | null> => {
    setIsCreating(true);
    try {
      const { data } = await api.post("/payments/create-intent", {
        rentalRequestId,
      });

      if (!data.success) {
        throw new Error(data.message || "Failed to create payment intent");
      }

      const result = data.data as CreatePaymentIntentResult;
      toast.success("Redirecting to payment gateway...");
      // Redirect to Stripe Checkout
      window.location.href = result.checkoutUrl;
      return result;
    } catch (error) {
      const axiosError = error as { response?: { data?: { message?: string } }; message?: string };
      const message =
        axiosError?.response?.data?.message ||
        axiosError?.message ||
        "Failed to initiate payment";
      toast.error(message);
      return null;
    } finally {
      setIsCreating(false);
    }
  };

  return { createIntent, isCreating };
};
