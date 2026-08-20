import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";

export interface LandlordDashboardStats {
  totalProperties: number;
  available: number;
  rented: number;
  pendingRequests: number;
  approvedRentals: number;
  totalIncome: number;
}

export const fetchLandlordDashboard = async (): Promise<LandlordDashboardStats> => {
  const { data } = await api.get("/landlord/dashboard");
  if (!data.success) {
    throw new Error(data.message || "Failed to fetch dashboard stats");
  }
  return data.data;
};

export const useLandlordDashboard = () => {
  return useQuery<LandlordDashboardStats, Error>({
    queryKey: ["landlord-dashboard"],
    queryFn: fetchLandlordDashboard,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    retry: 2,
    refetchOnWindowFocus: false,
  });
};
