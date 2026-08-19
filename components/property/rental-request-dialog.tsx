"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCreateRentalRequest } from "@/hooks/use-create-rental-request";
import type { CreateRentalRequestPayload } from "@/hooks/use-create-rental-request";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface RentalRequestDialogProps {
  propertyId: string;
  propertyTitle: string;
  propertyPrice: number;
  trigger?: React.ReactNode;
}

interface FormData {
  startDate: string;
  endDate: string;
}

export default function RentalRequestDialog({
  propertyId,
  propertyTitle,
  propertyPrice,
  trigger,
}: RentalRequestDialogProps) {
  const [open, setOpen] = useState(false);
  const { createRequest, isSubmitting } = useCreateRentalRequest();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      startDate: "",
      endDate: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    const payload: CreateRentalRequestPayload = {
      propertyId,
      startDate: data.startDate,
      endDate: data.endDate || undefined,
    };

    const result = await createRequest(payload);
    if (result) {
      reset();
      setOpen(false);
    }
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-BD", {
      style: "currency",
      currency: "BDT",
      maximumFractionDigits: 0,
    }).format(price);

  const today = new Date().toISOString().split("T")[0];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-5 font-semibold">
            Request Rental Booking
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Request Rental Booking</DialogTitle>
          <DialogDescription>
            Submit a rental request for <span className="font-medium text-foreground">{propertyTitle}</span>
            {propertyPrice > 0 && (
              <> at <span className="font-medium text-foreground">{formatPrice(propertyPrice)}/mo</span></>
            )}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="startDate">Start Date</Label>
            <div className="relative">
              <Input
                id="startDate"
                type="date"
                min={today}
                {...register("startDate", {
                  required: "Start date is required",
                  validate: (value) => {
                    if (new Date(value) < new Date(today)) {
                      return "Start date cannot be in the past";
                    }
                    return true;
                  },
                })}
                className={cn(errors.startDate && "border-rose-500 focus-visible:ring-rose-500/20")}
              />
              <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            </div>
            {errors.startDate && (
              <p className="text-xs text-rose-500 font-medium">{errors.startDate.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="endDate">End Date <span className="text-muted-foreground font-normal">(optional)</span></Label>
            <div className="relative">
              <Input
                id="endDate"
                type="date"
                {...register("endDate", {
                  validate: (value, formValues) => {
                    if (value && new Date(value) <= new Date(formValues.startDate)) {
                      return "End date must be after start date";
                    }
                    return true;
                  },
                })}
                className={cn(errors.endDate && "border-rose-500 focus-visible:ring-rose-500/20")}
              />
              <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            </div>
            {errors.endDate && (
              <p className="text-xs text-rose-500 font-medium">{errors.endDate.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Submitting...
                </div>
              ) : (
                "Submit Request"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
