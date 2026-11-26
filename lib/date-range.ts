export interface BookedDateRange {
  startDate: string;
  endDate: string | null;
  status: "APPROVED" | "ACTIVE" | string;
}

const ACTIVE_BOOKED_STATUSES = new Set(["APPROVED", "ACTIVE"]);

const toDayStartMs = (dateInput: string): number | null => {
  const normalized = dateInput.slice(0, 10);
  const parsed = Date.parse(`${normalized}T00:00:00Z`);
  return Number.isNaN(parsed) ? null : parsed;
};

export const getBlockingRanges = (
  ranges: BookedDateRange[],
): BookedDateRange[] =>
  ranges.filter((r) => ACTIVE_BOOKED_STATUSES.has(r.status));

/**
 * Returns `true` when `dateStr` (YYYY-MM-DD) falls within any `APPROVED` or
 * `ACTIVE` booked range.
 */
export const isDateInBookedRange = (
  dateStr: string,
  ranges: BookedDateRange[],
): boolean => {
  const target = toDayStartMs(dateStr);
  if (target === null) return false;

  return getBlockingRanges(ranges).some((range) => {
    const start = toDayStartMs(range.startDate);
    if (start === null) return false;

    if (!range.endDate) {
      return target >= start;
    }

    const end = toDayStartMs(range.endDate);
    if (end === null) return target >= start;

    return target >= start && target <= end;
  });
};

/**
 * Returns `true` when `[startStr, endStr]` overlaps any `APPROVED` or `ACTIVE`
 * booked range.
 */
export const doDateRangesOverlap = (
  startStr: string,
  endStr: string | undefined,
  ranges: BookedDateRange[],
): boolean => {
  const reqStart = toDayStartMs(startStr);
  if (reqStart === null) return false;

  const reqEnd = endStr ? toDayStartMs(endStr) : null;

  return getBlockingRanges(ranges).some((range) => {
    const bookedStart = toDayStartMs(range.startDate);
    if (bookedStart === null) return false;

    const bookedEnd = range.endDate ? toDayStartMs(range.endDate) : null;

    if (reqEnd === null && bookedEnd === null) return true;
    if (reqEnd === null) return bookedEnd !== null && reqStart <= bookedEnd;
    if (bookedEnd === null) return reqEnd >= bookedStart;

    return reqStart <= bookedEnd && reqEnd >= bookedStart;
  });
};

export const formatBookedRangeLabel = (range: BookedDateRange): string => {
  const opts: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    year: "numeric",
  };
  const start = new Date(range.startDate).toLocaleDateString("en-US", opts);
  if (!range.endDate) return `From ${start}`;
  const end = new Date(range.endDate).toLocaleDateString("en-US", opts);
  return `${start} – ${end}`;
};
