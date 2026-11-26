"use client";

import React, { useMemo, useState } from "react";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Loader2,
  ShieldCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateRentalRequest } from "@/hooks/use-create-rental-request";
import {
  doDateRangesOverlap,
  formatBookedRangeLabel,
  getBlockingRanges,
  isDateInBookedRange,
  type BookedDateRange,
} from "@/lib/date-range";
import { cn } from "@/lib/utils";
import type { PropertyStatus } from "@/types/property";

interface BookingRequestCardProps {
  propertyId: string;
  propertyTitle: string;
  propertyPrice: number;
  propertyStatus?: PropertyStatus;
  bookedDates: BookedDateRange[];
}

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const toIsoDate = (date: Date): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

export function BookingRequestCard({
  propertyId,
  propertyTitle,
  propertyPrice,
  propertyStatus = "AVAILABLE",
  bookedDates,
}: BookingRequestCardProps) {
  const todayStr = useMemo(() => toIsoDate(new Date()), []);
  const [viewMonth, setViewMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);

  const { createRequest, isSubmitting } = useCreateRentalRequest();
  const blockingRanges = useMemo(
    () => getBlockingRanges(bookedDates),
    [bookedDates],
  );

  const monthDays = useMemo(() => {
    const year = viewMonth.getFullYear();
    const month = viewMonth.getMonth();
    const firstWeekday = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const cells: Array<{ dateStr: string; day: number } | null> = [];
    for (let i = 0; i < firstWeekday; i++) cells.push(null);
    for (let day = 1; day <= daysInMonth; day++) {
      cells.push({
        dateStr: toIsoDate(new Date(year, month, day)),
        day,
      });
    }
    return cells;
  }, [viewMonth]);

  const monthLabel = viewMonth.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const handleCalendarDayClick = (dateStr: string) => {
    setValidationError(null);

    if (!startDate || (startDate && endDate)) {
      setStartDate(dateStr);
      setEndDate("");
      return;
    }

    if (dateStr <= startDate) {
      setStartDate(dateStr);
      setEndDate("");
      return;
    }

    if (doDateRangesOverlap(startDate, dateStr, blockingRanges)) {
      setValidationError(
        "Selected range overlaps with an already booked period.",
      );
      return;
    }

    setEndDate(dateStr);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!startDate) {
      setValidationError("Please select a move-in start date.");
      return;
    }

    if (startDate < todayStr) {
      setValidationError("Start date cannot be in the past.");
      return;
    }

    if (endDate && endDate <= startDate) {
      setValidationError("End date must be after start date.");
      return;
    }

    if (isDateInBookedRange(startDate, blockingRanges)) {
      setValidationError("The selected start date is already booked.");
      return;
    }

    if (doDateRangesOverlap(startDate, endDate || undefined, blockingRanges)) {
      setValidationError(
        "These dates overlap with an approved or active booking.",
      );
      return;
    }

    const result = await createRequest({
      propertyId,
      startDate,
      endDate: endDate || undefined,
    });

    if (result) {
      setStartDate("");
      setEndDate("");
    }
  };

  const formattedPrice = new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(propertyPrice);

  return (
    <div className="sticky top-24 flex flex-col gap-5 rounded-3xl border border-border/60 bg-card p-6 shadow-xl">
      <div className="flex items-baseline justify-between border-b border-border/40 pb-4">
        <div>
          <span className="font-heading text-2xl font-extrabold text-foreground">
            {formattedPrice}
          </span>
          <span className="text-xs text-muted-foreground"> / month</span>
        </div>
        <span
          className={cn(
            "rounded-full px-2.5 py-1 text-[11px] font-semibold",
            propertyStatus === "AVAILABLE"
              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
              : "bg-amber-500/10 text-amber-600 dark:text-amber-400",
          )}
        >
          {propertyStatus}
        </span>
      </div>

      {/* Availability Calendar */}
      <div className="space-y-3 rounded-2xl border border-border/60 bg-muted/20 p-3.5">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() =>
              setViewMonth(
                (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1),
              )
            }
            aria-label="Previous month"
            className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg hover:bg-muted"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          </button>
          <span className="text-xs font-semibold text-foreground">
            {monthLabel}
          </span>
          <button
            type="button"
            onClick={() =>
              setViewMonth(
                (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1),
              )
            }
            aria-label="Next month"
            className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg hover:bg-muted"
          >
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-medium text-muted-foreground">
          {WEEKDAYS.map((day) => (
            <div key={day} className="py-1">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {monthDays.map((cell, idx) => {
            if (!cell) {
              return <div key={`empty-${idx}`} className="h-8" />;
            }

            const isPast = cell.dateStr < todayStr;
            const isBooked = isDateInBookedRange(cell.dateStr, blockingRanges);
            const isDisabled = isPast || isBooked;
            const isSelectedStart = startDate === cell.dateStr;
            const isSelectedEnd = endDate === cell.dateStr;
            const isInSelection =
              Boolean(startDate && endDate) &&
              cell.dateStr > startDate &&
              cell.dateStr < endDate;

            return (
              <button
                key={cell.dateStr}
                type="button"
                disabled={isDisabled}
                onClick={() => handleCalendarDayClick(cell.dateStr)}
                title={isBooked ? "Unavailable (Booked)" : cell.dateStr}
                className={cn(
                  "flex h-8 items-center justify-center rounded-lg text-xs font-medium transition-colors",
                  isBooked &&
                    "cursor-not-allowed bg-rose-500/15 text-rose-500 line-through",
                  isPast &&
                    !isBooked &&
                    "cursor-not-allowed text-muted-foreground/40",
                  !isDisabled &&
                    !isSelectedStart &&
                    !isSelectedEnd &&
                    !isInSelection &&
                    "cursor-pointer hover:bg-blue-500/15 hover:text-blue-600",
                  isInSelection && "bg-blue-500/15 text-blue-600",
                  (isSelectedStart || isSelectedEnd) &&
                    "bg-blue-600 font-semibold text-white",
                )}
              >
                {cell.day}
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between pt-1 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-blue-600" />
            Selected
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-500/60" />
            Booked / Unavailable
          </span>
        </div>
      </div>

      {blockingRanges.length > 0 ? (
        <div className="space-y-1.5 rounded-xl border border-amber-500/30 bg-amber-500/5 p-3 text-xs">
          <p className="font-semibold text-amber-700 dark:text-amber-400">
            Reserved periods
          </p>
          <ul className="space-y-0.5 text-muted-foreground">
            {blockingRanges.slice(0, 3).map((range, i) => (
              <li key={i}>• {formatBookedRangeLabel(range)}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {/* Date Inputs & Submit */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="grid grid-cols-2 gap-2.5">
          <div className="space-y-1">
            <Label htmlFor="booking-start" className="text-xs">
              Start Date
            </Label>
            <Input
              id="booking-start"
              type="date"
              min={todayStr}
              value={startDate}
              onChange={(e) => {
                setValidationError(null);
                setStartDate(e.target.value);
              }}
              className="h-9 text-xs"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="booking-end" className="text-xs">
              End Date (opt.)
            </Label>
            <Input
              id="booking-end"
              type="date"
              min={startDate || todayStr}
              value={endDate}
              onChange={(e) => {
                setValidationError(null);
                setEndDate(e.target.value);
              }}
              className="h-9 text-xs"
            />
          </div>
        </div>

        {validationError ? (
          <p role="alert" className="text-xs font-medium text-rose-500">
            {validationError}
          </p>
        ) : null}

        <Button
          type="submit"
          disabled={isSubmitting || propertyStatus !== "AVAILABLE"}
          className="mt-1 w-full rounded-xl bg-blue-600 py-5 font-semibold text-white hover:bg-blue-700"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              Submitting...
            </span>
          ) : (
            `Request Booking for ${propertyTitle.split(" ").slice(0, 2).join(" ")}`
          )}
        </Button>
      </form>

      <div className="flex items-center justify-between border-t border-border/40 pt-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <Calendar className="h-3.5 w-3.5 text-blue-500" aria-hidden="true" />
          Instant request
        </span>
        <span className="flex items-center gap-1 font-medium text-emerald-600 dark:text-emerald-400">
          <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
          Verified Listing
        </span>
      </div>
    </div>
  );
}
