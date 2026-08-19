import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";

export interface MyPaymentResponse {
  id: string;
  amount: number;
  provider: string;
  transactionId: string | null;
  status: string;
  paidAt: string | null;
  createdAt: string;
  updatedAt: string;
  rentalRequest: {
    id: string;
    property: {
      title: string;
      location: string;
    };
  };
}

export const fetchMyPayments = async (): Promise<MyPaymentResponse[]> => {
  const { data } = await api.get("/payments/my-payments");
  if (!data.success) {
    throw new Error(data.message || "Failed to fetch payments");
  }
  return data.data ?? data ?? [];
};

export const useMyPayments = () => {
  return useQuery<MyPaymentResponse[], Error>({
    queryKey: ["my-payments"],
    queryFn: fetchMyPayments,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    retry: 2,
    refetchOnWindowFocus: false,
  });
};