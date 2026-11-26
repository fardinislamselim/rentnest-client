import type { PropertyStatus } from "@/types/property";

export type PropertySortBy = "price" | "createdAt" | "title" | "location";
export type SortOrder = "asc" | "desc";

export interface PropertySearchParams {
  search?: string;
  categoryId?: string;
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  status?: PropertyStatus;
  sortBy?: PropertySortBy;
  sortOrder?: SortOrder;
  page?: number;
  limit?: number;
}

const VALID_SORT_BY = new Set<PropertySortBy>([
  "price",
  "createdAt",
  "title",
  "location",
]);
const VALID_SORT_ORDER = new Set<SortOrder>(["asc", "desc"]);
const VALID_STATUS = new Set<PropertyStatus>([
  "AVAILABLE",
  "RENTED",
  "UNAVAILABLE",
]);

const readParam = (
  source: Record<string, string | string[] | undefined> | URLSearchParams,
  key: string,
): string | undefined => {
  if (source instanceof URLSearchParams) {
    const val = source.get(key)?.trim();
    return val ? val : undefined;
  }
  const raw = source[key];
  const val = Array.isArray(raw) ? raw[0] : raw;
  const trimmed = val?.trim();
  return trimmed ? trimmed : undefined;
};

const parsePositiveInt = (val?: string): number | undefined => {
  if (!val) return undefined;
  const num = Number(val);
  return Number.isInteger(num) && num > 0 ? num : undefined;
};

const parseNonNegativeNum = (val?: string): number | undefined => {
  if (!val) return undefined;
  const num = Number(val);
  return Number.isFinite(num) && num >= 0 ? num : undefined;
};

/**
 * Parses Next.js `searchParams` or `URLSearchParams` into typed property query
 * parameters, stripping empty or invalid values.
 */
export const parsePropertySearchParams = (
  source: Record<string, string | string[] | undefined> | URLSearchParams,
): PropertySearchParams => {
  const search = readParam(source, "search");
  const categoryId = readParam(source, "categoryId");
  const location = readParam(source, "location");
  const minPrice = parseNonNegativeNum(readParam(source, "minPrice"));
  const maxPrice = parseNonNegativeNum(readParam(source, "maxPrice"));
  const bedrooms = parsePositiveInt(readParam(source, "bedrooms"));
  const bathrooms = parsePositiveInt(readParam(source, "bathrooms"));

  const rawStatus = readParam(source, "status") as PropertyStatus | undefined;
  const status = rawStatus && VALID_STATUS.has(rawStatus) ? rawStatus : undefined;

  const rawSortBy = readParam(source, "sortBy") as PropertySortBy | undefined;
  const sortBy =
    rawSortBy && VALID_SORT_BY.has(rawSortBy) ? rawSortBy : undefined;

  const rawSortOrder = readParam(source, "sortOrder") as SortOrder | undefined;
  const sortOrder =
    rawSortOrder && VALID_SORT_ORDER.has(rawSortOrder)
      ? rawSortOrder
      : undefined;

  const page = parsePositiveInt(readParam(source, "page"));
  const limit = parsePositiveInt(readParam(source, "limit"));

  return {
    ...(search ? { search } : {}),
    ...(categoryId ? { categoryId } : {}),
    ...(location ? { location } : {}),
    ...(minPrice !== undefined ? { minPrice } : {}),
    ...(maxPrice !== undefined ? { maxPrice } : {}),
    ...(bedrooms !== undefined ? { bedrooms } : {}),
    ...(bathrooms !== undefined ? { bathrooms } : {}),
    ...(status ? { status } : {}),
    ...(sortBy ? { sortBy } : {}),
    ...(sortOrder ? { sortOrder } : {}),
    ...(page !== undefined ? { page } : {}),
    ...(limit !== undefined ? { limit } : {}),
  };
};

/**
 * Serializes a parameter object into a URL query string (without leading `?`),
 * omitting `undefined`, `null`, and empty string values.
 */
export const buildQueryString = (
  params: Record<string, string | number | boolean | undefined | null>,
): string => {
  const sp = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    const str = String(value).trim();
    if (str === "") return;
    sp.set(key, str);
  });
  return sp.toString();
};

/**
 * Merges filter updates into current `PropertySearchParams`, resetting `page`
 * to `1` whenever any non-pagination filter changes.
 */
export const mergePropertySearchParams = (
  current: PropertySearchParams,
  updates: Partial<PropertySearchParams>,
): PropertySearchParams => {
  const filterChanged = Object.keys(updates).some(
    (key) => key !== "page" && key !== "limit",
  );

  const merged: PropertySearchParams = {
    ...current,
    ...updates,
    ...(filterChanged && updates.page === undefined ? { page: 1 } : {}),
  };

  // Strip undefined/empty values
  return parsePropertySearchParams(
    Object.entries(merged).reduce<Record<string, string | undefined>>(
      (acc, [k, v]) => {
        acc[k] = v === undefined || v === null ? undefined : String(v);
        return acc;
      },
      {},
    ),
  );
};

export const countActivePropertyFilters = (
  params: PropertySearchParams,
): number => {
  const keys: (keyof PropertySearchParams)[] = [
    "search",
    "categoryId",
    "location",
    "minPrice",
    "maxPrice",
    "bedrooms",
    "bathrooms",
    "status",
  ];
  return keys.filter((k) => params[k] !== undefined).length;
};
