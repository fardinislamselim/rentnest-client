import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { toast } from "sonner";
import type { Property } from "@/types/property";

export const useTogglePropertyAvailability = () => {
  const [isToggling, setIsToggling] = useState(false);
  const queryClient = useQueryClient();

  const toggleAvailability = async (
    propertyId: string,
    currentAvailable: boolean
  ): Promise<boolean> => {
    const newAvailable = !currentAvailable;
    const newStatus = newAvailable ? "AVAILABLE" : "RENTED";

    setIsToggling(true);

    const previousProperties = queryClient.getQueryData<Property[]>([
      "my-properties",
    ]);

    queryClient.setQueryData(["my-properties"], (old: Property[] | undefined) => {
      if (!old) return old;
      return old.map((prop) =>
        prop.id === propertyId ? { ...prop, available: newAvailable } : prop
      );
    });

    try {
      const { data } = await api.patch(`/properties/${propertyId}`, {
        status: newStatus,
      });

      if (!data.success) {
        throw new Error(data.message || "Failed to update availability");
      }

      const statusText = newAvailable ? "Available" : "Rented";
      toast.success(`Property marked as ${statusText}`);
      return true;
    } catch (error) {
      queryClient.setQueryData(["my-properties"], previousProperties);

      const axiosError = error as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      const message =
        axiosError?.response?.data?.message ||
        axiosError?.message ||
        "Failed to update availability";
      toast.error(message);
      return false;
    } finally {
      setIsToggling(false);
    }
  };

  return { toggleAvailability, isToggling };
};
