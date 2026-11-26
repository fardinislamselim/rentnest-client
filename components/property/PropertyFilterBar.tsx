"use client";

import React, { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Category } from "@/hooks/use-categories";
import {
  buildQueryString,
  countActivePropertyFilters,
  mergePropertySearchParams,
  parsePropertySearchParams,
  type PropertySearchParams,
  type PropertySortBy,
  type SortOrder,
} from "@/lib/queryParams";

interface PropertyFilterBarProps {
  categories: Category[];
  initialParams: PropertySearchParams;
}

const SORT_OPTIONS: Array<{
  value: string;
  label: string;
  sortBy: PropertySortBy;
  sortOrder: SortOrder;
}> = [
  {
    value: "newest",
    label: "Newest",
    sortBy: "createdAt",
    sortOrder: "desc",
  },
  {
    value: "price-asc",
    label: "Price: Low to High",
    sortBy: "price",
    sortOrder: "asc",
  },
  {
    value: "price-desc",
    label: "Price: High to Low",
    sortBy: "price",
    sortOrder: "desc",
  },
];

export function PropertyFilterBar({
  categories,
  initialParams,
}: PropertyFilterBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentParams = useMemo(() => {
    const fromUrl = parsePropertySearchParams(searchParams);
    return Object.keys(fromUrl).length > 0 ? fromUrl : initialParams;
  }, [searchParams, initialParams]);

  const [searchInput, setSearchInput] = useState(currentParams.search ?? "");
  const [locationInput, setLocationInput] = useState(
    currentParams.location ?? "",
  );
  const [minPriceInput, setMinPriceInput] = useState(
    currentParams.minPrice !== undefined ? String(currentParams.minPrice) : "",
  );
  const [maxPriceInput, setMaxPriceInput] = useState(
    currentParams.maxPrice !== undefined ? String(currentParams.maxPrice) : "",
  );

  // Sync local inputs when URL resets externally (e.g. clicking Reset Filters).
  useEffect(() => {
    setSearchInput(currentParams.search ?? "");
    setLocationInput(currentParams.location ?? "");
    setMinPriceInput(
      currentParams.minPrice !== undefined
        ? String(currentParams.minPrice)
        : "",
    );
    setMaxPriceInput(
      currentParams.maxPrice !== undefined
        ? String(currentParams.maxPrice)
        : "",
    );
  }, [
    currentParams.search,
    currentParams.location,
    currentParams.minPrice,
    currentParams.maxPrice,
  ]);

  const pushUpdates = (updates: Partial<PropertySearchParams>) => {
    const next = mergePropertySearchParams(currentParams, updates);
    const qs = buildQueryString(next as Record<string, string | number>);
    router.push(qs ? `${pathname}?${qs}` : pathname);
  };

  // Debounce text inputs (search, location, minPrice, maxPrice)
  useEffect(() => {
    const timer = setTimeout(() => {
      const nextSearch = searchInput.trim() || undefined;
      const nextLocation = locationInput.trim() || undefined;
      const nextMin =
        minPriceInput.trim() !== "" && !Number.isNaN(Number(minPriceInput))
          ? Number(minPriceInput)
          : undefined;
      const nextMax =
        maxPriceInput.trim() !== "" && !Number.isNaN(Number(maxPriceInput))
          ? Number(maxPriceInput)
          : undefined;

      if (
        nextSearch !== currentParams.search ||
        nextLocation !== currentParams.location ||
        nextMin !== currentParams.minPrice ||
        nextMax !== currentParams.maxPrice
      ) {
        const next = mergePropertySearchParams(currentParams, {
          search: nextSearch,
          location: nextLocation,
          minPrice: nextMin,
          maxPrice: nextMax,
        });
        const qs = buildQueryString(next as Record<string, string | number>);
        router.push(qs ? `${pathname}?${qs}` : pathname);
      }
    }, 400);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput, locationInput, minPriceInput, maxPriceInput]);

  const resetAll = () => {
    setSearchInput("");
    setLocationInput("");
    setMinPriceInput("");
    setMaxPriceInput("");
    router.push(pathname);
  };

  const activeSortValue =
    SORT_OPTIONS.find(
      (opt) =>
        opt.sortBy === currentParams.sortBy &&
        opt.sortOrder === currentParams.sortOrder,
    )?.value ?? "newest";

  const activeFilterCount = countActivePropertyFilters(currentParams);

  const categoryNameById = useMemo(() => {
    const map = new Map<string, string>();
    categories.forEach((c) => map.set(c.id, c.name));
    return map;
  }, [categories]);

  const chips: Array<{ key: string; label: string; onClear: () => void }> = [];
  if (currentParams.search) {
    chips.push({
      key: "search",
      label: `Search: "${currentParams.search}"`,
      onClear: () => {
        setSearchInput("");
        pushUpdates({ search: undefined });
      },
    });
  }
  if (currentParams.location) {
    chips.push({
      key: "location",
      label: `Location: ${currentParams.location}`,
      onClear: () => {
        setLocationInput("");
        pushUpdates({ location: undefined });
      },
    });
  }
  if (currentParams.categoryId) {
    chips.push({
      key: "categoryId",
      label: `Category: ${categoryNameById.get(currentParams.categoryId) ?? "Selected"}`,
      onClear: () => pushUpdates({ categoryId: undefined }),
    });
  }
  if (currentParams.minPrice !== undefined) {
    chips.push({
      key: "minPrice",
      label: `Min: BDT ${currentParams.minPrice.toLocaleString()}`,
      onClear: () => {
        setMinPriceInput("");
        pushUpdates({ minPrice: undefined });
      },
    });
  }
  if (currentParams.maxPrice !== undefined) {
    chips.push({
      key: "maxPrice",
      label: `Max: BDT ${currentParams.maxPrice.toLocaleString()}`,
      onClear: () => {
        setMaxPriceInput("");
        pushUpdates({ maxPrice: undefined });
      },
    });
  }
  if (currentParams.bedrooms !== undefined) {
    chips.push({
      key: "bedrooms",
      label: `${currentParams.bedrooms}+ Bedrooms`,
      onClear: () => pushUpdates({ bedrooms: undefined }),
    });
  }

  return (
    <div className="mb-8 flex flex-col gap-4 rounded-2xl border border-border/60 bg-card p-4 shadow-sm sm:p-5">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-6">
        {/* Keyword Search */}
        <div className="relative lg:col-span-2">
          <Search
            className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            type="text"
            placeholder="Search title, description, location..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="rounded-xl pl-9"
            aria-label="Search properties"
          />
        </div>

        {/* Category */}
        <Select
          value={currentParams.categoryId ?? "ALL"}
          onValueChange={(value) =>
            pushUpdates({ categoryId: value === "ALL" ? undefined : value })
          }
        >
          <SelectTrigger className="rounded-xl" aria-label="Filter by category">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Location */}
        <Input
          type="text"
          placeholder="Location (e.g. Dhaka)"
          value={locationInput}
          onChange={(e) => setLocationInput(e.target.value)}
          className="rounded-xl"
          aria-label="Filter by location"
        />

        {/* Bedrooms */}
        <Select
          value={
            currentParams.bedrooms !== undefined
              ? String(currentParams.bedrooms)
              : "ALL"
          }
          onValueChange={(value) =>
            pushUpdates({
              bedrooms: value === "ALL" ? undefined : Number(value),
            })
          }
        >
          <SelectTrigger className="rounded-xl" aria-label="Filter by bedrooms">
            <SelectValue placeholder="Bedrooms" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Any Bedrooms</SelectItem>
            <SelectItem value="1">1+ Bedroom</SelectItem>
            <SelectItem value="2">2+ Bedrooms</SelectItem>
            <SelectItem value="3">3+ Bedrooms</SelectItem>
            <SelectItem value="4">4+ Bedrooms</SelectItem>
            <SelectItem value="5">5+ Bedrooms</SelectItem>
          </SelectContent>
        </Select>

        {/* Sort */}
        <Select
          value={activeSortValue}
          onValueChange={(value) => {
            const selected =
              SORT_OPTIONS.find((opt) => opt.value === value) ??
              SORT_OPTIONS[0];
            pushUpdates({
              sortBy: selected.sortBy,
              sortOrder: selected.sortOrder,
            });
          }}
        >
          <SelectTrigger className="rounded-xl" aria-label="Sort properties">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Price Range Row + Reset */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/40 pt-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <SlidersHorizontal className="h-3.5 w-3.5" aria-hidden="true" />
            Price (BDT):
          </span>
          <Input
            type="number"
            min={0}
            placeholder="Min"
            value={minPriceInput}
            onChange={(e) => setMinPriceInput(e.target.value)}
            className="h-9 w-28 rounded-xl text-xs"
            aria-label="Minimum price"
          />
          <span className="text-xs text-muted-foreground">–</span>
          <Input
            type="number"
            min={0}
            placeholder="Max"
            value={maxPriceInput}
            onChange={(e) => setMaxPriceInput(e.target.value)}
            className="h-9 w-28 rounded-xl text-xs"
            aria-label="Maximum price"
          />
        </div>

        {activeFilterCount > 0 ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={resetAll}
            className="cursor-pointer gap-1.5 rounded-xl text-xs text-rose-500 hover:bg-rose-500/10 hover:text-rose-600"
          >
            <X className="h-3.5 w-3.5" aria-hidden="true" />
            Reset Filters
          </Button>
        ) : null}
      </div>

      {/* Active Filter Chips */}
      {chips.length > 0 ? (
        <div className="flex flex-wrap items-center gap-2">
          {chips.map((chip) => (
            <button
              key={chip.key}
              type="button"
              onClick={chip.onClear}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-600 transition-colors hover:bg-blue-500/20 dark:text-blue-400"
            >
              <span>{chip.label}</span>
              <X className="h-3 w-3" aria-hidden="true" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
