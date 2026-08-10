"use client";

import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search, AlertCircle, Building2, RefreshCw, X } from "lucide-react";
import PropertyCard from "@/components/property/property-card";
import PropertyCardSkeleton from "@/components/property/property-card-skeleton";
import { useProperties } from "@/hooks/use-properties";
import { useCategories } from "@/hooks/use-categories";
import { Button } from "@/components/ui/button";

export default function PropertiesSection() {
  const searchParams = useSearchParams();

  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const [selectedLocation, setSelectedLocation] = useState(searchParams.get("location") || "");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || searchParams.get("type") || "");
  const [selectedBudget, setSelectedBudget] = useState(searchParams.get("budget") || "");

  const { data: categories } = useCategories();
  const { data: properties, isLoading, isError, error, refetch } = useProperties({
    location: selectedLocation || undefined,
    category: selectedCategory || undefined,
    budget: selectedBudget || undefined,
    search: searchTerm || undefined,
  });

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedLocation("");
    setSelectedCategory("");
    setSelectedBudget("");
  };

  const hasActiveFilters = Boolean(searchTerm || selectedLocation || selectedCategory || selectedBudget);

  return (
    <>
      {/* Filter Controls Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-card border border-border/60 shadow-sm mb-10 flex flex-col gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by title or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-muted/40 hover:bg-muted/60 dark:bg-zinc-950/40 border border-border/60 rounded-xl pl-9 pr-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-foreground"
            />
          </div>

          {/* Location Select */}
          <div className="relative">
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full bg-muted/40 hover:bg-muted/60 dark:bg-zinc-950/40 border border-border/60 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-foreground cursor-pointer"
            >
              <option value="">All Locations</option>
              <option value="Dhaka">Dhaka</option>
              <option value="Chattogram">Chattogram</option>
              <option value="Sylhet">Sylhet</option>
              <option value="Khulna">Khulna</option>
              <option value="Rajshahi">Rajshahi</option>
              <option value="Barishal">Barishal</option>
              <option value="Rangpur">Rangpur</option>
              <option value="Mymensingh">Mymensingh</option>
            </select>
          </div>

          {/* Category Select */}
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-muted/40 hover:bg-muted/60 dark:bg-zinc-950/40 border border-border/60 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-foreground cursor-pointer"
            >
              <option value="">All Categories</option>
              {categories?.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
              {!categories?.length && (
                <>
                  <option value="Apartment">Apartment</option>
                  <option value="Villa">Villa</option>
                  <option value="Studio">Studio</option>
                  <option value="Office">Office</option>
                  <option value="Duplex">Duplex</option>
                  <option value="Family House">Family House</option>
                </>
              )}
            </select>
          </div>

          {/* Budget Select */}
          <div className="relative">
            <select
              value={selectedBudget}
              onChange={(e) => setSelectedBudget(e.target.value)}
              className="w-full bg-muted/40 hover:bg-muted/60 dark:bg-zinc-950/40 border border-border/60 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-foreground cursor-pointer"
            >
              <option value="">Any Budget</option>
              <option value="0-15000">Under BDT 15,000</option>
              <option value="15000-30000">BDT 15k - 30k</option>
              <option value="30000-50000">BDT 30k - 50k</option>
              <option value="50000+">BDT 50,000+</option>
            </select>
          </div>

        </div>

        {/* Active Filters Clear Button */}
        {hasActiveFilters && (
          <div className="flex items-center justify-between pt-2 border-t border-border/40">
            <span className="text-xs text-muted-foreground font-medium">Active filters applied</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-xs text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 cursor-pointer flex items-center gap-1.5"
            >
              <X className="h-3.5 w-3.5" />
              Reset Filters
            </Button>
          </div>
        )}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <PropertyCardSkeleton key={i} />
          ))}
        </div>
      )}

      {/* Error State */}
      {!isLoading && isError && (
        <div className="flex flex-col items-center justify-center p-12 rounded-3xl border border-destructive/30 bg-destructive/5 text-center max-w-md mx-auto my-8 gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
            <AlertCircle className="h-7 w-7" />
          </div>
          <div className="flex flex-col gap-1">
            <h3 className="font-heading text-xl font-bold text-foreground">
              Something Went Wrong
            </h3>
            <p className="text-sm text-muted-foreground">
              {error?.message || "Failed to load properties from API."}
            </p>
          </div>
          <Button
            onClick={() => refetch()}
            variant="outline"
            className="mt-2 rounded-xl border-destructive/40 text-destructive hover:bg-destructive hover:text-destructive-foreground cursor-pointer flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Retry Fetching
          </Button>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !isError && (!properties || properties.length === 0) && (
        <div className="flex flex-col items-center justify-center p-12 rounded-3xl border border-border/60 bg-card text-center max-w-md mx-auto my-8 gap-4 shadow-sm">
          <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-blue-500/10 text-blue-600 dark:bg-blue-400/10">
            <Building2 className="h-8 w-8" />
          </div>
          <div className="flex flex-col gap-1">
            <h3 className="font-heading text-xl font-bold text-foreground">
              No Properties Found
            </h3>
            <p className="text-sm text-muted-foreground">
              We couldn&apos;t find any properties matching your current filter criteria.
            </p>
          </div>
          {hasActiveFilters && (
            <Button onClick={clearFilters} className="mt-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl cursor-pointer">
              Clear Filters
            </Button>
          )}
        </div>
      )}

      {/* Results Grid */}
      {!isLoading && !isError && properties && properties.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      )}
    </>
  );
}
