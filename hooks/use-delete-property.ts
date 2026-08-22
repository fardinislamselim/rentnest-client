import { useState } from "react";
import { api } from "@/lib/axios";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

export const useDeleteProperty = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const deleteProperty = async (propertyId: string): Promise<boolean> => {
    setIsSubmitting(true);
    try {
      const { data } = await api.delete(`/properties/${propertyId}`);
      if (!data.success) {
        throw new Error(data.message || "Failed to delete property");
      }
      toast.success("Property deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["my-properties"] });
      queryClient.invalidateQueries({ queryKey: ["landlord-dashboard"] });
      return true;
    } catch (error) {
      const axiosError = error as { response?: { data?: { message?: string } }; message?: string };
      const message =
        axiosError?.response?.data?.message ||
        axiosError?.message ||
        "Failed to delete property";
      toast.error(message);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { deleteProperty, isSubmitting };
};
